import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  constructor() { }

  private tag:string = "tag";

  //获取local
  get(key:string) {
    return JSON.parse(localStorage.getItem(`${this.tag}-local-${key}`));
  }

  //设置local
  set(key:string,val:any) {
    localStorage.setItem(`${this.tag}-local-${key}`,JSON.stringify(val));
  }
}
