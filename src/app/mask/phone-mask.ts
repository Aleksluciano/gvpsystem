export class MaskPhones {

  constructor(private obj: any){

  }

onKeyPressMobilePhone(event: any) {
  const pattern = /[0-9\+\-\ ]/;
  let inputChar = String.fromCharCode(event.charCode);

  if (
    (event.keyCode != 8 && !pattern.test(inputChar)) ||
    event.keyCode == 32
  ) {
    event.preventDefault();
  }

  let substr = this.obj['mobilePhone'].substring(0, 1);
  let oldString = this.obj['mobilePhone'];
  let lengthString = this.obj['mobilePhone'].length;

  if (substr == "(" && lengthString == 3)
  this.obj['mobilePhone'] = oldString + ") ";
  else if (substr != "(" && lengthString == 2) {
    this.obj['mobilePhone'] = "(" + oldString + ") ";
  }

  if (lengthString == 10) {
    this.obj['mobilePhone'] = this.obj['mobilePhone'] + "-";
  }


}

onKeyPressPhone(event: any) {
  const pattern = /[0-9\+\-\ ]/;
  let inputChar = String.fromCharCode(event.charCode);

  if (
    (event.keyCode != 8 && !pattern.test(inputChar)) ||
    event.keyCode == 32
  ) {
    event.preventDefault();
  }

  let substr = this.obj['phone'].substring(0, 1);
  let oldString = this.obj['phone'];
  let lengthString = this.obj['phone'].length;

  if (substr == "(" && lengthString == 3) this.obj['phone'] = oldString + ") ";
  else if (substr != "(" && lengthString == 2) {
    this.obj['phone'] = "(" + oldString + ") ";
  }

  if (lengthString == 9) {
    this.obj['phone'] = this.obj['phone'] + "-";
  }


}

}
