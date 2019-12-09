export function wait(seconds: number){
  const futureDate=new Date(new Date().getTime() + (seconds *1000));
  while(futureDate>new Date()){}
}
