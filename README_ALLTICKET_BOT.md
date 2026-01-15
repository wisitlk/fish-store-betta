# AllTicket Auto-Bot - Setup and Usage Guide

## 🎫 Overview
A Windows Desktop application that automates ticket purchasing on AllTicket.com with precise timing control.

---

## 📋 Prerequisites
- **Python 3.8+** installed on Windows
- **Google Chrome** browser installed
- **Internet connection**

---

## ⚙️ Installation

### Step 1: Install Dependencies
Open Command Prompt or PowerShell in the project directory and run:

```bash
pip install -r requirements.txt
```

This will install:
- `selenium` (web automation)
- `webdriver-manager` (automatic ChromeDriver management)

### Step 2: Verify Installation
Check that Python packages are installed:

```bash
pip list | findstr selenium
```

---

## 🚀 Usage Instructions

### Step-by-Step Workflow

1. **Launch the Application**
   ```bash
   python allticket_bot.py
   ```

2. **Configure Settings**
   - **Target URL**: Enter the AllTicket event URL (default is GenieFest27)
   - **Target Time**: Set the exact time to start purchasing (format: `HH:MM:SS`)
   - **Ticket Quantity**: Select 1-6 tickets from dropdown

3. **Manual Login Phase**
   - Click **"Launch Browser"** button
   - Chrome will open with the target URL
   - **Manually log in** to your AllTicket account
   - Solve any CAPTCHAs if present
   - **Do NOT close the browser**

4. **Start Automation**
   - Once logged in, return to the app
   - Click **"Start Bot"** button
   - The app will count down to your target time
   - Watch the log window for status updates

5. **Automation Sequence** (at target time)
   - Page refreshes automatically
   - Finds and clicks the "Buy" button
   - Selects first available round/zone
   - Selects your ticket quantity
   - Checks "Agree to Terms"
   - Clicks "Confirm"

6. **Monitor Progress**
   - All actions are logged in real-time
   - Check the log window for status and errors
   - The browser remains open for you to complete payment

---

## 🛠️ Customization

### Updating Selectors
If AllTicket changes their website layout, you may need to update the selectors in `allticket_bot.py`:

**Buy Button** (line ~275):
```python
selectors = [
    (By.XPATH, "//button[contains(text(), 'Buy Now')]"),
    (By.XPATH, "//button[contains(text(), 'ซื้อบัตร')]"),
    # Add your custom selector here
]
```

**Round/Zone Selection** (line ~300):
```python
round_selectors = [
    (By.XPATH, "//div[contains(@class, 'round')]//button[1]"),
    # Add your custom selector here
]
```

**To find the correct selector:**
1. Right-click on the element in Chrome
2. Select "Inspect"
3. Right-click on the highlighted HTML
4. Copy → Copy XPath or Copy selector

---

## ⚠️ Important Notes

### Threading
- The GUI uses threading to remain responsive during countdown
- The GUI **will not freeze** while waiting for target time
- You can click "Stop" at any time to cancel

### Browser Detach Mode
- Chrome stays open even if the Python script finishes
- This allows you to complete payment manually
- Close Chrome manually when done

### Time Configuration
- Use 24-hour format: `13:00:00` = 1:00 PM
- If target time has passed today, it assumes tomorrow
- The log will confirm the exact target datetime

### Error Handling
- All errors are logged to the log window
- The app won't crash on selenium errors
- Check the log for troubleshooting

---

## 🐛 Troubleshooting

### "Browser failed to launch"
- Ensure Chrome is installed
- Check your internet connection (ChromeDriver downloads automatically)
- Try running as administrator

### "Could not find Buy button"
- The website layout may have changed
- Check the browser manually to see the button
- Update the selectors (see Customization section)
- The button might not be available yet (event not open)

### "GUI is frozen"
- This shouldn't happen due to threading
- If it does, check if Python is responding in Task Manager
- Try restarting the application

### ChromeDriver Version Mismatch
- `webdriver-manager` handles this automatically
- If issues persist, clear the cache: `%USERPROFILE%\.wdm`

---

## 📝 Example Usage

**Scenario**: Buy 2 tickets for GenieFest27 at exactly 2:00 PM

1. Run: `python allticket_bot.py`
2. Set Target URL: `https://www.allticket.com/event/geniefest27`
3. Set Target Time: `14:00:00`
4. Set Quantity: `2`
5. Click "Launch Browser"
6. Log in to AllTicket
7. Click "Start Bot"
8. Wait for countdown → automation runs at 2:00 PM

---

## 🔐 Security & Ethics

- This tool is for **personal use only**
- Do not use for scalping or reselling
- Respect AllTicket's terms of service
- Use responsibly and ethically

---

## 💡 Tips

- **Test the timing**: Set a target time 1-2 minutes in the future to test
- **Stay logged in**: Don't log out after launching the browser
- **Have payment ready**: The bot only automates selection, not payment
- **Be quick**: Other users may be using similar tools
- **Backup plan**: Always have manual purchasing as backup

---

## 📞 Support

If you encounter issues:
1. Check the log window for error messages
2. Verify Chrome and Python versions
3. Update selectors if website changed
4. Ensure good internet connection

---

**Good luck getting your tickets! 🎉**
