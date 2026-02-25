export class DateUtils {
    /**
     * Holidays for 2026 in Brazil (National)
     * Format: MM-DD
     */
    private static readonly FIXED_HOLIDAYS_BR = [
        "01-01", // Confraternização Universal
        "04-21", // Tiradentes
        "05-01", // Dia do Trabalho
        "09-07", // Independência do Brasil
        "10-12", // Nossa Senhora Aparecida
        "11-02", // Finados
        "11-15", // Proclamação da República
        "11-20", // Dia de Zumbi e da Consciência Negra
        "12-25", // Natal
    ];

    /**
     * Mobile Holidays for 2026 (Brazil)
     */
    private static readonly MOBILE_HOLIDAYS_2026 = [
        "2026-02-16", // Carnaval (Segunda)
        "2026-02-17", // Carnaval (Terça)
        "2026-04-03", // Sexta-feira Santa
        "2026-06-04", // Corpus Christi
    ];

    public static isHoliday(date: Date): boolean {
        const dateStr = date.toISOString().split('T')[0];
        const monthDay = dateStr.substring(5); // MM-DD

        if (this.FIXED_HOLIDAYS_BR.includes(monthDay)) return true;
        if (this.MOBILE_HOLIDAYS_2026.includes(dateStr)) return true;

        return false;
    }

    public static isWeekend(date: Date): boolean {
        const day = date.getDay();
        return day === 0 || day === 6; // Sunday or Saturday
    }

    /**
     * Calculates the number of working days (Brazilian calendar) between two dates.
     */
    public static calculateWorkingDays(startDate: Date, endDate: Date): number {
        if (startDate > endDate) return 0;

        let workingDays = 0;
        const current = new Date(startDate);

        while (current <= endDate) {
            if (!this.isWeekend(current) && !this.isHoliday(current)) {
                workingDays++;
            }
            current.setDate(current.getDate() + 1);
        }

        return workingDays;
    }

    /**
     * Estimates remaining school days in the semester.
     */
    public static getRemainingDiasLetivos(fromDate: Date): number {
        const year = fromDate.getFullYear();
        const month = fromDate.getMonth(); // 0-indexed

        // Assuming standard semesters: 1st (Jan-Jun), 2nd (Jul-Dec)
        // Usually ends around June 30 or Dec 20
        let semesterEnd: Date;
        if (month < 6) {
            semesterEnd = new Date(year, 5, 30); // June 30
        } else {
            semesterEnd = new Date(year, 11, 20); // Dec 20 (before Christmas)
        }

        return this.calculateWorkingDays(fromDate, semesterEnd);
    }
}
