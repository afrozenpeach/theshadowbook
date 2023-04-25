import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  constructor(private http: HttpClient) {
  }

  getUser() {
    let user = JSON.parse(localStorage.getItem('user') ?? '');

    if (user) {
      return this.http.get<any>('/api/user/' + user.uid);
    } else {
      let result = new Subject<any>;
      result.next(null);
      result.complete();

      return result.asObservable();
    }
  }

  createUser() {
    let user = JSON.parse(localStorage.getItem('user') ?? '');

    return this.http.post('/api/user', {
      email: user.email,
      uid: user.uid
    });
  }

  updateUser(userData: any) {
    return this.http.put('/api/user', {
      name: userData.name,
      profile: userData.profile,
      sunSign: userData.sunSign,
      moonSign: userData.moonSign,
      risingSign: userData.risingSign,
      id: userData.id
    });
  }

  updateUserEmail(userData: any) {
    return this.http.put('/api/user/email', {
      email: userData.email,
      id: userData.id
    });
  }

  getZodiacs() {
    return this.http.get<any>('/api/zodiac', {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  isValidUserName(name: any) {
    let user = JSON.parse(localStorage.getItem('user') ?? '');

    return this.http.get<any>('/api/user/checkName/' + name + '/' + user.uid);
  }

  getCrystals() {
    return this.http.get<any>('/api/crystals', {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  getCrystal(name: String) {
    return this.http.get<any>('/api/crystals/' + name, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  updateCrystal(crystal: any) {
    return this.http.put<any>('/api/crystals/' + crystal.id, {crystal});
  }

  createCrystal(crystal: any) {
    return this.http.post<any>('/api/crystals/' + crystal.id, {crystal});
  }

  getChakras() {
    return this.http.get<any>('/api/chakras');
  }

  getCleansings() {
    return this.http.get<any>('/api/cleansings');
  }

  getDomains() {
    return this.http.get<any>('/api/domains');
  }

  getElements() {
    return this.http.get<any>('/api/elements');
  }

  getMoonPhases() {
    return this.http.get<any>('/api/moonPhases');
  }

  addCrystalToCollection(id: number, userId: number) {
    return this.http.post<any>('/api/collection/crystals', {
      id: id,
      userId: userId
    });
  }

  getUserCrystals(userId: number) {
    return this.http.get<any>('/api/collection/crystals/' + userId);
  }
}
