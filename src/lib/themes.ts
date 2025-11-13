
export interface Theme {
    name: string;
    values: { [key: string]: string };
}

export const themes: Theme[] = [
    {
        name: 'Original',
        values: {
            '--background': '43 100% 96%',
            '--foreground': '240 10% 3.9%',
            '--card': '43 100% 98%',
            '--primary': '77 24% 23%',
            '--primary-foreground': '43 100% 96%',
            '--secondary': '33 19% 90%',
            '--accent': '34 75% 54%',
        },
    },
    {
        name: 'Jungle',
        values: {
            '--background': '150 15% 97%',
            '--foreground': '158 35% 10%',
            '--card': '150 15% 99%',
            '--primary': '158 34% 23%',
            '--primary-foreground': '150 20% 95%',
            '--secondary': '155 25% 90%',
            '--accent': '150 40% 45%',
        }
    },
    {
        name: 'Ocean',
        values: {
            '--background': '200 30% 97%',
            '--foreground': '212 45% 18%',
            '--card': '200 30% 99%',
            '--primary': '201 82% 27%',
            '--primary-foreground': '200 30% 97%',
            '--secondary': '195 40% 92%',
            '--accent': '166 47% 46%',
        }
    },
    {
        name: 'Sunset',
        values: {
            '--background': '222 28% 15%',
            '--foreground': '222 20% 95%',
            '--card': '222 28% 18%',
            '--primary': '222 28% 30%',
            '--primary-foreground': '222 20% 95%',
            '--secondary': '222 15% 40%',
            '--accent': '21 88% 75%',
        }
    },
    {
        name: 'Crimson',
        values: {
            '--background': '11 55% 92%',
            '--foreground': '60 1% 17%',
            '--card': '11 50% 96%',
            '--primary': '356 90% 32%',
            '--primary-foreground': '11 55% 92%',
            '--secondary': '216 4% 85%',
            '--accent': '4 85% 46%',
        }
    }
];
