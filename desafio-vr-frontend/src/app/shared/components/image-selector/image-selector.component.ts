import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-image-selector',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, FormsModule],
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.scss']
})
export class ImageSelectorComponent {
  @Input()
  imagemBase64: string | null = null;
  @Output() fileSelected = new EventEmitter<string|null>();


  onFileSelected(evt: Event) {
    const input = evt.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    if (!['image/png','image/jpeg'].includes(file.type)) {
      return alert('Só PNG ou JPEG.');
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.imagemBase64 = reader.result as string;
      this.fileSelected.emit(this.imagemBase64);
    };
    reader.readAsDataURL(file);
  }

  clearSelectedImage() {
    this.imagemBase64 = null;
    this.fileSelected.emit(null);
  }
}
