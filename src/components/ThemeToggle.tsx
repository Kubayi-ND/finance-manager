
import { useTheme } from "@/providers/ThemeProvider";


export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <label className="relative inline-flex items-center cursor-pointer">
          <input className="sr-only peer" value="" type="checkbox" />
          <div
            className="w-20 h-8 rounded-full ring-0 peer duration-500 outline-none bg-gray-200 overflow-hidden before:flex before:items-center before:justify-center after:flex after:items-center after:justify-center before:content-['☀️'] before:absolute before:h-6 before:w-6 before:top-1/2 before:bg-white before:rounded-full before:left-1 before:-translate-y-1/2 before:transition-all before:duration-700 peer-checked:before:opacity-0 peer-checked:before:rotate-90 peer-checked:before:-translate-y-full shadow-lg shadow-gray-400 peer-checked:shadow-lg peer-checked:shadow-gray-700 peer-checked:bg-[#383838] after:content-['🌑'] after:absolute after:bg-white after:rounded-full after:top-[4px] after:right-1 after:translate-y-full after:w-6 after:h-6 after:opacity-0 after:transition-all after:duration-700 peer-checked:after:opacity-100 peer-checked:after:rotate-180 peer-checked:after:translate-y-0"
            onClick={theme === "light" ? () => setTheme("dark") : () => setTheme("light")}
          ></div>
        </label>
    </div>
          
  );
}
