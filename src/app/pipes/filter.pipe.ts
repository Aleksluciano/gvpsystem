import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: string, filterString: string, propName: string, propName2: string,): any {

    if(value.length === 0 || filterString === "") return value;

    let resultArray = [];

    for(let item of value){
      let name = item[propName] + ' ' + item[propName2];
      if(name.toUpperCase().substring(0,filterString.length) ===
         filterString.toUpperCase().substring(0,filterString.length)){
        resultArray.push(item);
      }
    }

    return resultArray;
  }

}
