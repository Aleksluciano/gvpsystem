export class MaskPhones {

  constructor(private obj: any){

  }

onKeyPressMobilePhone(event: any, property: string = 'mobilePhone') {

  const pattern = /[0-9\+\-\ ]/;
  let inputChar = String.fromCharCode(event.charCode);

  if (
    (event.keyCode != 8 && !pattern.test(inputChar)) ||
    event.keyCode == 32
  ) {
    event.preventDefault();
  }

  let substr = this.obj[property].substring(0, 1);
  let oldString = this.obj[property];
  let lengthString = this.obj[property].length;

  if (substr == "(" && lengthString == 3)
  this.obj[property] = oldString + ") ";
  else if (substr != "(" && lengthString == 2) {
    this.obj[property] = "(" + oldString + ") ";
  }

  if (lengthString == 10) {
    this.obj[property] = this.obj[property] + "-";
  }


}

onKeyPressPhone(event: any, property: string = 'phone') {
 
  const pattern = /[0-9\+\-\ ]/;
  let inputChar = String.fromCharCode(event.charCode);

  if (
    (event.keyCode != 8 && !pattern.test(inputChar)) ||
    event.keyCode == 32
  ) {
    event.preventDefault();
  }

  let substr = this.obj[property].substring(0, 1);
  let oldString = this.obj[property];
  let lengthString = this.obj[property].length;

  if (substr == "(" && lengthString == 3) this.obj[property] = oldString + ") ";
  else if (substr != "(" && lengthString == 2) {
    this.obj[property] = "(" + oldString + ") ";
  }

  if (lengthString == 9) {
    this.obj[property] = this.obj[property] + "-";
  }


}

}
