"""
AllTicket Auto-Bot - Desktop Application for Automated Ticket Purchasing
Author: Senior Python Developer
Description: A Windows Desktop GUI application to automate ticket purchasing on AllTicket.com
"""

import tkinter as tk
from tkinter import ttk, scrolledtext, messagebox
from datetime import datetime, timedelta
import threading
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException, WebDriverException
from webdriver_manager.chrome import ChromeDriverManager


class TicketBotApp:
    """Main application class for AllTicket Auto-Bot"""
    
    def __init__(self, root):
        """Initialize the application"""
        self.root = root
        self.root.title("AllTicket Auto-Bot")
        self.root.geometry("700x600")
        self.root.resizable(False, False)
        
        # Application state variables
        self.driver = None
        self.bot_running = False
        self.stop_requested = False
        self.countdown_thread = None
        
        # Setup GUI
        self.setup_gui()
        
        # Protocol for closing window
        self.root.protocol("WM_DELETE_WINDOW", self.on_closing)
        
    def setup_gui(self):
        """Setup the GUI layout and components"""
        
        # Main frame with padding
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Title Label
        title_label = ttk.Label(
            main_frame, 
            text="AllTicket Auto-Bot", 
            font=("Arial", 18, "bold")
        )
        title_label.grid(row=0, column=0, columnspan=2, pady=(0, 20))
        
        # Input Fields Frame
        input_frame = ttk.LabelFrame(main_frame, text="Configuration", padding="10")
        input_frame.grid(row=1, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=(0, 10))
        
        # Target URL
        ttk.Label(input_frame, text="Target URL:").grid(row=0, column=0, sticky=tk.W, pady=5)
        self.url_var = tk.StringVar(value="https://www.allticket.com/event/geniefest27")
        self.url_entry = ttk.Entry(input_frame, textvariable=self.url_var, width=50)
        self.url_entry.grid(row=0, column=1, pady=5, padx=(10, 0))
        
        # Target Time
        ttk.Label(input_frame, text="Target Time (HH:MM:SS):").grid(row=1, column=0, sticky=tk.W, pady=5)
        self.time_var = tk.StringVar(value="13:00:00")
        self.time_entry = ttk.Entry(input_frame, textvariable=self.time_var, width=50)
        self.time_entry.grid(row=1, column=1, pady=5, padx=(10, 0))
        
        # Ticket Quantity
        ttk.Label(input_frame, text="Ticket Quantity:").grid(row=2, column=0, sticky=tk.W, pady=5)
        self.quantity_var = tk.StringVar(value="1")
        self.quantity_combo = ttk.Combobox(
            input_frame, 
            textvariable=self.quantity_var, 
            values=["1", "2", "3", "4", "5", "6"],
            state="readonly",
            width=47
        )
        self.quantity_combo.grid(row=2, column=1, pady=5, padx=(10, 0))
        
        # Buttons Frame
        button_frame = ttk.Frame(main_frame)
        button_frame.grid(row=2, column=0, columnspan=2, pady=(0, 10))
        
        # Launch Browser Button
        self.launch_btn = ttk.Button(
            button_frame, 
            text="Launch Browser", 
            command=self.launch_browser,
            width=20
        )
        self.launch_btn.grid(row=0, column=0, padx=5)
        
        # Start Bot Button
        self.start_btn = ttk.Button(
            button_frame, 
            text="Start Bot", 
            command=self.start_bot,
            width=20,
            state=tk.DISABLED
        )
        self.start_btn.grid(row=0, column=1, padx=5)
        
        # Stop Button
        self.stop_btn = ttk.Button(
            button_frame, 
            text="Stop", 
            command=self.stop_bot,
            width=20,
            state=tk.DISABLED
        )
        self.stop_btn.grid(row=0, column=2, padx=5)
        
        # Log Window Frame
        log_frame = ttk.LabelFrame(main_frame, text="Log", padding="10")
        log_frame.grid(row=3, column=0, columnspan=2, sticky=(tk.W, tk.E, tk.N, tk.S), pady=(0, 10))
        
        # Scrollable Log Text Area
        self.log_text = scrolledtext.ScrolledText(
            log_frame, 
            width=80, 
            height=20, 
            wrap=tk.WORD,
            state=tk.DISABLED,
            font=("Courier", 9)
        )
        self.log_text.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Configure grid weights for resizing
        main_frame.columnconfigure(0, weight=1)
        main_frame.rowconfigure(3, weight=1)
        log_frame.columnconfigure(0, weight=1)
        log_frame.rowconfigure(0, weight=1)
        
    def log(self, message):
        """Add a message to the log window with timestamp"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        log_message = f"[{timestamp}] {message}\n"
        
        self.log_text.configure(state=tk.NORMAL)
        self.log_text.insert(tk.END, log_message)
        self.log_text.see(tk.END)
        self.log_text.configure(state=tk.DISABLED)
        
    def launch_browser(self):
        """Launch Chrome browser for manual login"""
        try:
            self.log("Launching Chrome browser...")
            
            # Chrome options for detached mode
            chrome_options = Options()
            chrome_options.add_experimental_option("detach", True)
            chrome_options.add_argument("--start-maximized")
            chrome_options.add_experimental_option("excludeSwitches", ["enable-logging"])
            
            # Initialize driver with webdriver-manager
            service = Service(ChromeDriverManager().install())
            self.driver = webdriver.Chrome(service=service, options=chrome_options)
            
            # Navigate to target URL
            url = self.url_var.get()
            self.driver.get(url)
            
            self.log("Browser opened successfully!")
            self.log("Please log in manually and solve any CAPTCHAs.")
            self.log("Once logged in, click 'Start Bot' to begin automation.")
            
            # Enable Start Bot button
            self.start_btn.configure(state=tk.NORMAL)
            self.launch_btn.configure(state=tk.DISABLED)
            
        except WebDriverException as e:
            self.log(f"ERROR: Failed to launch browser: {str(e)}")
            messagebox.showerror("Browser Error", f"Failed to launch browser:\n{str(e)}")
        except Exception as e:
            self.log(f"ERROR: Unexpected error: {str(e)}")
            messagebox.showerror("Error", f"Unexpected error:\n{str(e)}")
            
    def start_bot(self):
        """Start the bot automation"""
        if not self.driver:
            messagebox.showerror("Error", "Please launch the browser first!")
            return
            
        if self.bot_running:
            messagebox.showwarning("Warning", "Bot is already running!")
            return
            
        # Validate time format
        try:
            time_str = self.time_var.get()
            datetime.strptime(time_str, "%H:%M:%S")
        except ValueError:
            messagebox.showerror("Error", "Invalid time format! Use HH:MM:SS")
            return
            
        self.bot_running = True
        self.stop_requested = False
        
        # Update button states
        self.start_btn.configure(state=tk.DISABLED)
        self.stop_btn.configure(state=tk.NORMAL)
        self.launch_btn.configure(state=tk.DISABLED)
        
        # Start countdown in separate thread
        self.countdown_thread = threading.Thread(target=self.countdown_and_execute, daemon=True)
        self.countdown_thread.start()
        
        self.log("Bot started! Waiting for target time...")
        
    def stop_bot(self):
        """Stop the bot and close browser"""
        self.stop_requested = True
        self.bot_running = False
        
        self.log("Stopping bot...")
        
        try:
            if self.driver:
                self.driver.quit()
                self.driver = None
                self.log("Browser closed.")
        except Exception as e:
            self.log(f"ERROR closing browser: {str(e)}")
            
        # Reset button states
        self.start_btn.configure(state=tk.DISABLED)
        self.stop_btn.configure(state=tk.DISABLED)
        self.launch_btn.configure(state=tk.NORMAL)
        
        self.log("Bot stopped.")
        
    def countdown_and_execute(self):
        """Countdown to target time and execute automation"""
        try:
            # Parse target time
            target_time_str = self.time_var.get()
            target_hour, target_min, target_sec = map(int, target_time_str.split(":"))
            
            # Get current date and create target datetime
            now = datetime.now()
            target_time = now.replace(hour=target_hour, minute=target_min, second=target_sec, microsecond=0)
            
            # If target time is in the past today, assume it's for tomorrow
            if target_time <= now:
                target_time += timedelta(days=1)
                self.log(f"Target time is tomorrow: {target_time.strftime('%Y-%m-%d %H:%M:%S')}")
            else:
                self.log(f"Target time: {target_time.strftime('%Y-%m-%d %H:%M:%S')}")
            
            # Countdown loop
            while not self.stop_requested:
                now = datetime.now()
                time_diff = (target_time - now).total_seconds()
                
                if time_diff <= 0:
                    # Time reached!
                    self.log("TARGET TIME REACHED! Starting automation...")
                    self.execute_automation()
                    break
                elif time_diff <= 10:
                    # Log every second in the final 10 seconds
                    self.log(f"Time remaining: {int(time_diff)}s")
                    time.sleep(1)
                elif time_diff <= 60:
                    # Log every 5 seconds in the final minute
                    if int(time_diff) % 5 == 0:
                        self.log(f"Time remaining: {int(time_diff)}s")
                    time.sleep(1)
                else:
                    # Log every 30 seconds when more than a minute away
                    mins = int(time_diff // 60)
                    secs = int(time_diff % 60)
                    self.log(f"Time remaining: {mins}m {secs}s")
                    time.sleep(30)
                    
        except Exception as e:
            self.log(f"ERROR in countdown: {str(e)}")
            self.bot_running = False
            self.root.after(0, lambda: self.stop_btn.configure(state=tk.DISABLED))
            
    def execute_automation(self):
        """Execute the ticket purchasing automation"""
        try:
            if not self.driver or self.stop_requested:
                return
                
            # Step 1: Refresh the page
            self.log("Refreshing page...")
            self.driver.refresh()
            time.sleep(1)
            
            # Step 2: Wait for and click the Buy button
            self.log("Looking for Buy button...")
            wait = WebDriverWait(self.driver, 30)
            
            # Try multiple selectors for the Buy button
            buy_button = None
            selectors = [
                (By.XPATH, "//button[contains(text(), 'Buy Now')]"),
                (By.XPATH, "//button[contains(text(), 'ซื้อบัตร')]"),
                (By.XPATH, "//button[contains(@class, 'buy')]"),
                (By.XPATH, "//a[contains(text(), 'Buy Now')]"),
                (By.XPATH, "//a[contains(text(), 'ซื้อบัตร')]"),
                (By.CSS_SELECTOR, "button.btn-buy"),
                (By.CSS_SELECTOR, "a.btn-buy"),
            ]
            
            for by, selector in selectors:
                try:
                    buy_button = wait.until(EC.element_to_be_clickable((by, selector)))
                    self.log(f"Buy button found with selector: {selector}")
                    break
                except TimeoutException:
                    continue
                    
            if not buy_button:
                self.log("ERROR: Could not find Buy button!")
                return
                
            buy_button.click()
            self.log("Buy button clicked!")
            time.sleep(2)
            
            # Step 3: Select the first available Round/Zone
            self.log("Selecting round/zone...")
            try:
                # Try to find and click the first round/zone option
                round_selectors = [
                    (By.XPATH, "//div[contains(@class, 'round')]//button[1]"),
                    (By.XPATH, "//div[contains(@class, 'zone')]//button[1]"),
                    (By.CSS_SELECTOR, ".round-option:first-child"),
                    (By.CSS_SELECTOR, ".zone-option:first-child"),
                ]
                
                for by, selector in round_selectors:
                    try:
                        round_button = wait.until(EC.element_to_be_clickable((by, selector)))
                        round_button.click()
                        self.log("Round/Zone selected!")
                        break
                    except TimeoutException:
                        continue
                time.sleep(1)
            except Exception as e:
                self.log(f"WARNING: Could not select round/zone: {str(e)}")
                
            # Step 4: Select quantity
            self.log(f"Selecting quantity: {self.quantity_var.get()}...")
            try:
                quantity_selectors = [
                    (By.XPATH, "//select[@name='quantity']"),
                    (By.XPATH, "//select[contains(@class, 'quantity')]"),
                    (By.CSS_SELECTOR, "select.qty"),
                ]
                
                for by, selector in quantity_selectors:
                    try:
                        quantity_dropdown = wait.until(EC.presence_of_element_located((by, selector)))
                        quantity_dropdown.send_keys(self.quantity_var.get())
                        self.log("Quantity selected!")
                        break
                    except TimeoutException:
                        continue
                time.sleep(1)
            except Exception as e:
                self.log(f"WARNING: Could not select quantity: {str(e)}")
                
            # Step 5: Check "Agree to Terms" checkbox
            self.log("Checking terms agreement...")
            try:
                terms_selectors = [
                    (By.XPATH, "//input[@type='checkbox']"),
                    (By.XPATH, "//input[contains(@name, 'terms')]"),
                    (By.XPATH, "//input[contains(@name, 'agree')]"),
                ]
                
                for by, selector in terms_selectors:
                    try:
                        terms_checkbox = wait.until(EC.element_to_be_clickable((by, selector)))
                        if not terms_checkbox.is_selected():
                            terms_checkbox.click()
                            self.log("Terms checkbox checked!")
                        break
                    except TimeoutException:
                        continue
                time.sleep(1)
            except Exception as e:
                self.log(f"WARNING: Could not check terms: {str(e)}")
                
            # Step 6: Click Confirm button
            self.log("Looking for Confirm button...")
            try:
                confirm_selectors = [
                    (By.XPATH, "//button[contains(text(), 'Confirm')]"),
                    (By.XPATH, "//button[contains(text(), 'ยืนยัน')]"),
                    (By.XPATH, "//button[contains(@class, 'confirm')]"),
                    (By.CSS_SELECTOR, "button.btn-confirm"),
                ]
                
                for by, selector in confirm_selectors:
                    try:
                        confirm_button = wait.until(EC.element_to_be_clickable((by, selector)))
                        confirm_button.click()
                        self.log("Confirm button clicked!")
                        self.log("✓ AUTOMATION COMPLETE!")
                        break
                    except TimeoutException:
                        continue
            except Exception as e:
                self.log(f"WARNING: Could not click confirm: {str(e)}")
                
            self.log("Process finished. Please check the browser for results.")
            
        except Exception as e:
            self.log(f"ERROR during automation: {str(e)}")
        finally:
            self.bot_running = False
            # Update UI in main thread
            self.root.after(0, lambda: self.stop_btn.configure(state=tk.DISABLED))
            
    def on_closing(self):
        """Handle window closing event"""
        if self.bot_running:
            if messagebox.askokcancel("Quit", "Bot is running. Do you want to quit?"):
                self.stop_requested = True
                if self.driver:
                    try:
                        self.driver.quit()
                    except:
                        pass
                self.root.destroy()
        else:
            if self.driver:
                if messagebox.askokcancel("Quit", "Browser is still open. Close it?"):
                    try:
                        self.driver.quit()
                    except:
                        pass
                    self.root.destroy()
            else:
                self.root.destroy()


def main():
    """Main entry point"""
    root = tk.Tk()
    app = TicketBotApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
