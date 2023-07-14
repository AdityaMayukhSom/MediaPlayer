export function convertHMS(timeInSeconds: number | string) {
  const sec: number =
    typeof timeInSeconds === "string"
      ? parseInt(timeInSeconds, 10) // converts timeInSeconds to number if it's string
      : timeInSeconds;

  let hour = Math.floor(sec / 3600);
  let minute = Math.floor((sec % 3600) / 60);
  let second = Math.floor((sec % 3600) % 60);

  let hourString: string = hour.toString();
  let minuteString: string = minute.toString();
  let secondString: string = second.toString();

  if (hour < 10) {
    hourString = "0" + hourString;
  }
  if (minute < 10) {
    minuteString = "0" + minuteString;
  }
  if (second < 10) {
    secondString = "0" + secondString;
  }
  return hourString + ":" + minuteString + ":" + secondString; // Return is HH : MM : SS
}
