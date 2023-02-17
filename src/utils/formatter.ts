import days from "dayjs";

export function joinedDate(ISO: string): string {
  const date = days(ISO);
  const formateDate = `Joined ${date.format("DD MM YY")}`;
  return formateDate;
}
