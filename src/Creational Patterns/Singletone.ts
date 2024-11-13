class Singleton {
    private static instance: Singleton | null = null;

    private constructor() {}

    public static getInstance(): Singleton {
        if (!Singleton.instance) {
            Singleton.instance = new Singleton();
        }
        return Singleton.instance;
    }

    public someMethod(): void {
        console.log("someMethod");
    }
}

const instance1 = Singleton.getInstance();
const instance2 = Singleton.getInstance();

console.log(instance1 === instance2); // true

type ThemeType = "light" | "dark";

interface ThemeColors {
    background: string;
    text: string;
    primary: string;
}

class ThemeManager {
    private static instance: ThemeManager | null = null;
    private currentTheme: ThemeType = "light";

    private themeColors = {
        light: {
            background: "#FFFFFF",
            text: "#000000",
            primary: "#007AFF",
        },
        dark: {
            background: "#000000",
            text: "#FFFFFF",
            primary: "#0A84FF",
        },
    };

    private constructor() {}

    public static getInstance(): ThemeManager {
        if (!ThemeManager.instance) {
            ThemeManager.instance = new ThemeManager();
        }
        return ThemeManager.instance;
    }

    public getTheme(): ThemeType {
        return this.currentTheme;
    }

    public getColors(): ThemeColors {
        return this.themeColors[this.currentTheme];
    }

    public toggleTheme(): void {
        this.currentTheme = this.currentTheme === "light" ? "dark" : "light";
        console.log(`테마가 ${this.currentTheme}로 변경되었습니다.`);
    }
}

// 사용 예시
const themeManager1 = ThemeManager.getInstance();
const themeManager2 = ThemeManager.getInstance();

console.log("현재 테마:", themeManager1.getTheme()); // 'light'
console.log("현재 색상:", themeManager1.getColors()); // light 테마 색상

themeManager1.toggleTheme();
console.log("변경된 테마:", themeManager2.getTheme()); // 'dark' (다른 인스턴스에서도 동일한 상태 유지)
console.log("변경된 색상:", themeManager2.getColors()); // dark 테마 색상
