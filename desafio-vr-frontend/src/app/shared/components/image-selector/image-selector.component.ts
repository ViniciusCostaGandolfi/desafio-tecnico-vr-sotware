import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-image-selector',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, FormsModule],
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.scss']
})
export class ImageSelectorComponent {
  @Input() imagemBase64: string | null = null;
  @Output() fileSelected = new EventEmitter<string | null>();

  constructor(private readonly snackBar: MatSnackBar) {}

  onFileSelected(evt: Event): void {
    const input = evt.target as HTMLInputElement;
    if (input.files?.length) {
      this.handleImage(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.handleImage(file);
    }
  }

  private handleImage(file: File): void {
    if (!this.validateFile(file)) {
      this.snackBar.open('Formato inválido! Aceitamos apenas PNG ou JPG.', 'Fechar', {
        panelClass: ['error-snackbar'],
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'end',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imagemBase64 = reader.result as string;
      this.fileSelected.emit(this.imagemBase64);
    };
    reader.readAsDataURL(file);
  }

  private validateFile(file: File): boolean {
    return file.type === 'image/png' || file.type === 'image/jpeg';
  }

  clearSelectedImage(): void {
    this.imagemBase64 = null;
    this.fileSelected.emit(null);
  }
}