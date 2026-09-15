/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
    theme: {
        extend: {
            borderRadius: { lg: 'var(--radius)', md: 'calc(var(--radius) - 2px)', sm: 'calc(var(--radius) - 4px)' },
            colors: {
                background: 'rgb(var(--color-background) / <alpha-value>)',
                foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
                card: { DEFAULT: 'rgb(var(--color-card) / <alpha-value>)', foreground: 'rgb(var(--color-foreground) / <alpha-value>)' },
                popover: { DEFAULT: 'rgb(var(--color-card) / <alpha-value>)', foreground: 'rgb(var(--color-foreground) / <alpha-value>)' },
                primary: { DEFAULT: 'rgb(var(--color-amber) / <alpha-value>)', foreground: 'rgb(var(--color-background) / <alpha-value>)' },
                secondary: { DEFAULT: 'rgb(var(--color-cyan) / <alpha-value>)', foreground: 'rgb(var(--color-background) / <alpha-value>)' },
                muted: { DEFAULT: 'rgb(var(--color-card) / <alpha-value>)', foreground: 'rgb(var(--color-muted) / <alpha-value>)' },
                accent: { DEFAULT: 'rgb(var(--color-amber) / <alpha-value>)', foreground: 'rgb(var(--color-background) / <alpha-value>)' },
                destructive: { DEFAULT: 'rgb(var(--color-red) / <alpha-value>)', foreground: 'rgb(var(--color-foreground) / <alpha-value>)' },
                border: 'rgb(var(--color-border) / <alpha-value>)',
                input: 'rgb(var(--color-border) / <alpha-value>)',
                ring: 'rgb(var(--color-amber) / <alpha-value>)',
                navy: 'rgb(var(--color-night) / <alpha-value>)',
                gold: 'rgb(var(--color-amber) / <alpha-value>)',
                blue: 'rgb(var(--color-cyan) / <alpha-value>)',
                charcoal: 'rgb(var(--color-charcoal) / <alpha-value>)'
            },
            fontFamily: {
                heading: ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                display: ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'ui-monospace', 'monospace']
            },
            keyframes: {
                'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
                'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out'
            }
        }
    },
    plugins: [require("tailwindcss-animate")],
}
