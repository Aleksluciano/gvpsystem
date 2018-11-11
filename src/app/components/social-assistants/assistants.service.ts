import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";

import { Subject } from "rxjs";
import { map } from "rxjs/operators";

import { Assistant } from "./assistant.model";
import { FlashMessagesService } from "angular2-flash-messages";

const BACKEND_URL = environment.apiUrl + "/assistants/";

@Injectable({
  providedIn: "root"
})
export class AssistantsService {
  private assistants: Assistant[] = [];
  private assistantsUpdated = new Subject<Assistant[]>();
  private warnFlashMessage = new Subject<void>();

  constructor(
    private _flashMessagesService: FlashMessagesService,
    private http: HttpClient,
    private router: Router
  ) {}

  createAssistant(assistant: Assistant) {
    this.http
      .post<{ message: string; assistant: any }>(BACKEND_URL, assistant)
      .pipe(
        map(
          responseData =>
            <Assistant>{
              id: responseData.assistant._id,
              name: responseData.assistant.name,
              hospitals: [...responseData.assistant.hospitals],
              mobilePhone: responseData.assistant.mobilePhone,
              phone: responseData.assistant.phone
            }
        )
      )
      .subscribe(newAssistant => {
        this.assistants.unshift(newAssistant);
        this.assistantsUpdated.next([...this.assistants]);
        this._flashMessagesService.show("Nova assistente social adicionada", {
          cssClass: "alert-success",
          timeout: 2000
        });
      });
  }

  getAssistantsServer() {
    this.http
      .get<{ message: string; assistants: any[] }>(BACKEND_URL)
      .pipe(
        map(responseData => {
          return {
            assistants: responseData.assistants.map(
              assistant =>
                <Assistant>{
                  id: assistant._id,
                  name: assistant.name,
                  hospitals: [...assistant.hospitals],
                  mobilePhone: assistant.mobilePhone,
                  phone: assistant.phone
                }
            )
          };
        })
      )
      .subscribe(responseData => {
        this.assistants = responseData.assistants;

        this.assistants.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });

        this.assistantsUpdated.next([...this.assistants]);
      });
  }

  get Assistants() {
    return this.assistants || [];
  }

  getAssistantsUpdateListener() {
    return this.assistantsUpdated.asObservable();
  }

  deleteAssistant(id: string) {
    return this.http.delete(BACKEND_URL + id).subscribe(() => {
      this.assistants.forEach((u, index) => {
        if (u.id == id) this.assistants.splice(index, 1);
      });
      this.assistantsUpdated.next([...this.assistants]);
      this._flashMessagesService.show("Assistente social removido", {
        cssClass: "alert-success",
        timeout: 2000
      });
    });
  }

  getAssistant(id: string) {
    let assistant = this.assistants.filter(u => u.id == id);
    return assistant[0];
  }

  updateAssistant(id: string, assistant: Assistant) {
    this.http.put(BACKEND_URL + id, assistant).subscribe(responseData => {
      this.assistants = this.assistants.map(u => {
        if (u.id == id) u = assistant;
        return u;
      });
      this.assistantsUpdated.next([...this.assistants]);
      this._flashMessagesService.show("Assistente social atualizado", {
        cssClass: "alert-success",
        timeout: 2000
      });
    });
  }

  warnFlashMessageListener() {
    return this.warnFlashMessage.asObservable();
  }
}
