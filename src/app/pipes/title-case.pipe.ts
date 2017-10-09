import { Pipe, PipeTransform } from '@angular/core';

@Pipe ({
  name: 'titleCase'
})
export class TitleCasePipe implements PipeTransform {
  transform(value: string): any {
    if (!value) {
      return null;
    }

    const words = value.split(' ');
    for (let i = 0; i < words.length; i++) {
      if (i !== 0 && this.isPreposition(words[i])) {
        words[i] = words[i].toLowerCase();
      } else {
        words[i] = this.toTitleCase(words[i]);
      }
    }
    return words.join(' ');
  }

  private toTitleCase(word: string): string {
    return word.charAt(0).toUpperCase() + word.toLowerCase().slice(1);
  }

  private isPreposition(word: string): boolean {
    const prepositions = ['the', 'of'];
    return prepositions.includes(word.toLowerCase());
  }
}
