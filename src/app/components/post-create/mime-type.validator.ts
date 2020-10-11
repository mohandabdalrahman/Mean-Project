import { AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';

export const checkMimeType = (
  control: AbstractControl
): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  const file = control.value as File;
  const fileReader = new FileReader();
  const frObs = Observable.create(() => {
    fileReader.addEventListener('loadend', () => {

    })
    fileReader.readAsArrayBuffer(file)
  })
  return frObs;
};
