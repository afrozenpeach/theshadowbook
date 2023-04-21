import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  constructor(private http: HttpClient, private angularFireAuth: AngularFireAuth) {
  }

  getUser() {
    let user = JSON.parse(localStorage.getItem('user') ?? '');

    return this.http.get<any>('/api/user/' + user.uid, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.stsTokenManager.accessToken}`
      }
    });
  }

  createUser() {
    let user = JSON.parse(localStorage.getItem('user') ?? '');
    console.log(user);
    return this.http.post('/api/user', {
      email: user.email,
      uid: user.uid
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.stsTokenManager.accessToken}`
      }
    });
  }

  updateUser(userData: any) {
    let user = JSON.parse(localStorage.getItem('user') ?? '');

    return this.http.put('/api/user', {
      name: userData.name,
      profile: userData.profile,
      sunSign: userData.sunSign,
      moonSign: userData.moonSign,
      risingSign: userData.risingSign,
      id: userData.id
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.stsTokenManager.accessToken}`
      }
    });
  }

  updateUserEmail(userData: any) {
    let user = JSON.parse(localStorage.getItem('user') ?? '');

    return this.http.put('/api/user/email', {
      email: userData.email,
      id: userData.id
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.stsTokenManager.accessToken}`
      }
    });
  }

  getZodiacs() {
    let user = JSON.parse(localStorage.getItem('user') ?? '');

    return this.http.get<any>('/api/zodiac', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.stsTokenManager.accessToken}`
      }
    });
  }

  isValidUserName(name: any) {
    let user = JSON.parse(localStorage.getItem('user') ?? '');

    return this.http.get<any>('/api/user/checkName/' + name + '/' + user.uid, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.stsTokenManager.accessToken}`
      }
    });
  }

  getCrystals() {
    let user = JSON.parse(localStorage.getItem('user') ?? '');

    return this.http.get<any>('/api/crystals', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.stsTokenManager.accessToken}`
      }
    });
  }

  getCrystal(name: String) {
    let user = JSON.parse(localStorage.getItem('user') ?? '');

    return this.http.get<any>('/api/crystals/' + name, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.stsTokenManager.accessToken}`
      }
    });
  }

  updateCrystal(crystal: any) {
    let user = JSON.parse(localStorage.getItem('user') ?? '');

    return this.http.put<any>('/api/crystals/' + crystal.id, {crystal}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.stsTokenManager.accessToken}`
      }
    });
  }

  getChakras() {
    let user = JSON.parse(localStorage.getItem('user') ?? '');

    return this.http.get<any>('/api/chakras', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.stsTokenManager.accessToken}`
      }
    });
  }

  getCleansings() {
    let user = JSON.parse(localStorage.getItem('user') ?? '');

    return this.http.get<any>('/api/cleansings', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.stsTokenManager.accessToken}`
      }
    });
  }

  getDomains() {
    let user = JSON.parse(localStorage.getItem('user') ?? '');

    return this.http.get<any>('/api/domains', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.stsTokenManager.accessToken}`
      }
    });
  }

  getElements() {
    let user = JSON.parse(localStorage.getItem('user') ?? '');

    return this.http.get<any>('/api/elements', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.stsTokenManager.accessToken}`
      }
    });
  }

  getMoonPhases() {
    let user = JSON.parse(localStorage.getItem('user') ?? '');

    return this.http.get<any>('/api/moonPhases', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.stsTokenManager.accessToken}`
      }
    });
  }
}
