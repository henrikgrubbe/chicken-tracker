import {Observable, Subject} from "rxjs";
import type {ToastData} from "@/types/ToastData";

export class ToastService {
  private static readonly toastSubject: Subject<ToastData> = new Subject<ToastData>();
  public static readonly toast$: Observable<ToastData> = ToastService.toastSubject.asObservable();

  public static showToast(toastData: ToastData) {
    ToastService.toastSubject.next(toastData);
  }
}
