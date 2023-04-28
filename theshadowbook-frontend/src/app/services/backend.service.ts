import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  constructor(private http: HttpClient) {
  }

  getUser() {
    let user = JSON.parse(localStorage.getItem('user') ?? 'null');

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
    let user = JSON.parse(localStorage.getItem('user') ?? 'null');

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
    return this.http.get<any>('/api/zodiac');
  }

  isValidUserName(name: any) {
    let user = JSON.parse(localStorage.getItem('user') ?? 'null');

    return this.http.get<any>('/api/user/checkName/' + name + '/' + user.uid);
  }

  getCrystals() {
    return this.http.get<any>('/api/crystals');
  }

  getCrystal(name: String, subType: String|null = null) {
    if (subType === null) {
      return this.http.get<any>('/api/crystals/' + name);
    } else {
      return this.http.get<any>('/api/crystals/' + name + '/' + subType);
    }
  }

  updateCrystal(crystal: any) {
    return this.http.put<any>('/api/crystals/' + crystal.id, {crystal});
  }

  updateCrystalSubType(subType: any, crystal: number) {
    return this.http.put<any>('/api/crystalSubTypes/' + subType.id, {subType, crystal});
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

  addCrystalToCollection(id: number, userId: number, status: number) {
    return this.http.post<any>('/api/collection/crystals', {
      id: id,
      userId: userId,
      status: status,
      subType: null
    });
  }

  addCrystalSubTypeToCollection(id: number, crystalId: number, userId: number, status: number) {
    return this.http.post<any>('/api/collection/crystals', {
      id: crystalId,
      userId: userId,
      status: status,
      subType: id
    });
  }

  getUserCrystals(userId: number) {
    return this.http.get<any>('/api/collection/crystals/' + userId);
  }

  getStatuses() {
    return this.http.get<any>('/api/statuses');
  }

  getColors() {
    return this.http.get<any>('/api/colors');
  }

  saveUserCrystal(crystal: any) {
    return this.http.put<any>('/api/collection/crystals', {
      id: crystal.id,
      name: crystal.name,
      primaryColor: crystal.primaryColor,
      secondaryColor: crystal.secondaryColor,
      tertiaryColor: crystal.tertiaryColor,
      aura: crystal.aura,
      sizeX: crystal.sizeX,
      sizeY: crystal.sizeY,
      sizeZ: crystal.sizeZ,
      weight: crystal.weight,
      karat: crystal.karat,
      status: crystal.status,
      shape: crystal.shape,
      notes: crystal.notes,
      subType: crystal.subType
    });
  };

  deleteUserCrystal(id: number) {
    return this.http.delete<any>('/api/collection/crystals/' + id);
  }

  getShapes() {
    return this.http.get<any>('/api/shapes');
  }

  getDecks() {
    return this.http.get<any>('/api/decks');
  }

  getUserDecks(userId: number) {
    return this.http.get<any>('/api/collection/decks/' + userId);
  }

  addDeckToCollection(id: number, userId: number, status: number) {
    return this.http.post<any>('/api/collection/decks', {
      id: id,
      userId: userId,
      status: status
    });
  }

  getDeckTypes() {
    return this.http.get<any>('/api/deckTypes');
  }

  getDeck(name: String) {
    return this.http.get<any>('/api/decks/' + name);
  }

  updateDeck(deck: any) {
    return this.http.put<any>('/api/decks/' + deck.id, {deck});
  }

  createDeck(deck: any) {
    return this.http.post<any>('/api/decks/' + deck.id, {deck});
  }

  saveUserDeck(deck: any) {
    return this.http.put<any>('/api/collection/decks', {
      id: deck.id,
      name: deck.name,
      status: deck.status,
      notes: deck.notes
    });
  }

  deleteUserDeck(id: number) {
    return this.http.delete<any>('/api/collection/decks/' + id);
  }

  getCrystalSubTypes() {
    return this.http.get<any>('/api/crystalSubTypes');
  }

  addCrystalSubType(crystal: number, type: String) {
    return this.http.post<any>('/api/crystalSubTypes', {
      crystal: crystal,
      type: type
    });
  }

  deleteCrystalSubType(id: number) {
    return this.http.delete<any>('/api/crystalSubTypes/' + id);
  }
}
