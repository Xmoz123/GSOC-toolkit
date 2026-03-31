import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssetComponent } from './asset.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, AssetComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  assets = signal<any[]>([]);
  selectedId = signal<string | null>(null);
  gridSize = 30;

  showGrid = signal<boolean>(true);
  currentBgIndex = signal<number>(0);
  backgrounds = ['#1a1d20', '#ffffff', '#f8f9fa', '#dee2e6']; 

  selectedAsset = computed(() => 
    this.assets().find(a => a.id === this.selectedId())
  );

  addasset(type: string, color: string) {
    let default_value = 0;
    let default_color = color;
  
    if (type === 'Move') {
      default_value = 50;
      default_color = '#0dcaf0';
    } else if (type === 'Rotate') {
      default_value = 45;
      default_color = '#a855f7'; 
    } else if (type === 'Robot') {
      default_color = '#ffffff';
    } else if (type === 'Cat') {
      default_color = '#ff9f43';
    }

    const newItem = {
      id: `item-${Date.now()}`,
      type: type,
      color: default_color,
      position: { x: 300, y: 300 },
      value: default_value,
      rotation: 0,
      scale: 1,
      speechText: '' 
    };

    this.assets.update(all => [...all, newItem]);
    this.selectedId.set(newItem.id);
  }

  onMoveEnd(newPos: {x: number, y: number}, item: any) {
    const snappedX = Math.round(newPos.x / this.gridSize) * this.gridSize;
    const snappedY = Math.round(newPos.y / this.gridSize) * this.gridSize;
    
    this.assets.update(all => all.map(a => 
      a.id === item.id ? { ...a, position: { x: snappedX, y: snappedY } } : a
    ));
    this.selectedId.set(item.id);
  }

  duplicateSelected() {
    const active = this.selectedAsset();
    if (active) {
      const copy = { ...active, id: `copy-${Date.now()}`, position: { x: active.position.x + 30, y: active.position.y + 30 }};
      this.assets.update(all => [...all, copy]);
      this.selectedId.set(copy.id);
    }
  }

  deleteSelected() {
    this.assets.update(all => all.filter(a => a.id !== this.selectedId()));
    this.selectedId.set(null);
  }

  toggleGrid() { this.showGrid.update(v => !v); }
  toggleBackground() { this.currentBgIndex.update(i => (i + 1) % this.backgrounds.length); }
  clearcanvas() { this.assets.set([]); this.selectedId.set(null); }
  export_as_json() 
  {
  const dataStr = JSON.stringify(this.assets(), null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = window.URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `gsoc-sandbox-export-${Date.now()}.json`; 
  link.click();
  window.URL.revokeObjectURL(url);
}
}
