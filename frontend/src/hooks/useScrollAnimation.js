import { useEffect, useRef } from 'react';

export const useScrollAnimation = () => {
    const elementsRef = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px',
            }
        );

        elementsRef.current.forEach((el) => {
            if (el) observer.observe(el);
        });

        return () => {
            elementsRef.current.forEach((el) => {
                if (el) observer.unobserve(el);
            });
        };
    }, []);

    return elementsRef;
};
