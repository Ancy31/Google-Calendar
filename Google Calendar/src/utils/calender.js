const now = new Date();
const year = now.getFullYear();
const month = now.getMonth();

const firstDayOfMonth = new Date(year, month, 1);

const daysInMonth = new Date(year, month + 1, 0).getDate();
console.log(daysInMonth);
export const allDays = [];

const startPaddingCount = firstDayOfMonth.getDay();

export const dateFetching =()=>{


for (let i = startPaddingCount - 1; i >= 0; i--) {
  allDays.push(new Date(year, month, 1 - i - 1));
}

for (let i = 1; i <= daysInMonth; i++) {
  allDays.push(new Date(year, month, i));
}

const totalDaysNeeded = allDays.length <= 35 ? 35 : 42;
let nextMonthDay = 1;

while (allDays.length < totalDaysNeeded) {
  allDays.push(new Date(year, month + 1, nextMonthDay));
  console.log(allDays);
  nextMonthDay++;
}
};