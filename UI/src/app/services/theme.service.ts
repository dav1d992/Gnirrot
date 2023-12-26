/* eslint-disable @typescript-eslint/naming-convention */
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private themeLink = this.document.getElementById('theme') as HTMLLinkElement;
  public theme: string | null = null;

  constructor(@Inject(DOCUMENT) private document: Document) {
    if (localStorage.getItem('theme')) {
      this.theme = localStorage.getItem('theme');
      this.themeLink.href = localStorage.getItem('theme') + '.css';
      this.updateCssVariables();
    } else this.setTheme('bootstrap4-light-blue');
  }

  public setTheme(theme: string) {
    this.theme = theme;
    localStorage.setItem('theme', this.theme);

    if (this.themeLink) {
      this.themeLink.href = this.theme + '.css';
      this.updateCssVariables();
    }
  }

  private updateCssVariables() {
    if (this.isDarkMode()) {
      // Dark mode colors
      this.document.documentElement.style.setProperty(
        '--background-color',
        'rgba(52, 62, 77)'
      );
      this.document.documentElement.style.setProperty('--green', '#0F9D58'); // Dark mode green
      this.document.documentElement.style.setProperty('--red', '#DB4437'); // Dark mode red
      this.document.documentElement.style.setProperty('--yellow', '#F4B400'); // Dark mode yellow
    } else {
      // Light mode colors
      this.document.documentElement.style.setProperty(
        '--background-color',
        'rgba(239, 239, 239)'
      );
      this.document.documentElement.style.setProperty('--green', '#34A853'); // Light mode green
      this.document.documentElement.style.setProperty('--red', '#EA4335'); // Light mode red
      this.document.documentElement.style.setProperty('--yellow', '#FBBC05'); // Light mode yellow
    }
  }

  public isDarkMode(): boolean {
    if (!this.theme) {
      return false;
    }

    if (this.theme === 'bootstrap4-dark-blue') {
      return true;
    }

    return false;
  }
}
