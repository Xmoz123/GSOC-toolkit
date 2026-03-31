import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-asset',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="asset-root" 
         [class.selected]="isSelected"
         [style.left.px]="data.position.x"
         [style.top.px]="data.position.y"
         [style.transform]="'rotate(' + (data.rotation || 0) + 'deg) scale(' + (data.scale || 1) + ')'"
         (mousedown)="onGrab($event)">
      
      <div *ngIf="data.speechText" class="speech-bubble">
        {{ data.speechText }}
      </div>

      <div class="content-wrapper" [style.color]="data.color">
        <i *ngIf="data.type === 'Robot'" class="bi bi-robot agent-icon"></i>
       

        
        <div *ngIf="data.type === 'Move'" class="action-block move-bg">
          <i class="bi bi-play-circle me-2"></i> MOVE <span>{{data.value}}</span>
        </div>

        <div *ngIf="data.type === 'Cat'" 
        [style.background-color]="data.color"
        class="agent-cat-icon">
        </div>

        <div *ngIf="data.type === 'Rotate'" class="action-block rotate-bg">
          <i class="bi bi-arrow-clockwise me-2"></i> ROTATE <span>{{data.value}}</span>
        </div>

        <div *ngIf="data.type === 'Square'" class="shape-sq" [style.backgroundColor]="data.color"></div>
        <div *ngIf="data.type === 'Circle'" class="shape-ci" [style.backgroundColor]="data.color"></div>
        <div *ngIf="data.type === 'Triangle'" class="shape-tr" [style.borderBottomColor]="data.color"></div>
      </div>
    </div>
  `,
  styles: [`
    .asset-root {
      position: absolute;
      cursor: grab;
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 10;
      user-select: none;
    }

    .asset-root:active { cursor: grabbing; }

    .selected .content-wrapper {
      outline: 2px solid #0d6efd;
      outline-offset: 8px;
      border-radius: 4px;
    }

    .agent-icon {
      font-family: "bootstrap-icons" !important;
      font-size: 4.5rem;
      display: inline-block;
      filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
    }

    .agent-cat-icon {
  /* 1. Set the size to match your other agents */
  width: 80px; 
  height: 80px;
  display: inline-block;

  /* 2. Point to the image in your 'public' folder */
  -webkit-mask-image: url('/Catrobat.png');
  mask-image: url('/Catrobat.png');

  /* 3. Make sure the 'stencil' fits the box */
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  
  /* 4. Optional: Add a transition for smooth color changes */
  transition: background-color 0.3s ease;
}

    .agent-img {
    width: 100px;
    height: 100px;
    object-fit: contain;
    display: block;
    filter: sepia(1) saturate(5) hue-rotate(180deg);
    }

    .action-block {
      padding: 12px 20px;
      border-radius: 10px;
      color: white;
      font-weight: bold;
      display: flex;
      align-items: center;
      min-width: 140px;
      border: 2px solid rgba(255,255,255,0.2);
    }
    .move-bg { background: #0dcaf0; }
    .rotate-bg { background: #a855f7; }

    .speech-bubble {
      position: absolute;
      top: -55px;
      background: white;
      color: black;
      padding: 6px 14px;
      border-radius: 12px;
      font-weight: bold;
      font-size: 0.9rem;
      border: 2px solid #333;
      white-space: nowrap;
      pointer-events: none;
      z-index: 20;
    }

    .speech-bubble::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 10px solid #333;
    }

    .shape-sq { width: 65px; height: 65px; }
    .shape-ci { width: 65px; height: 65px; border-radius: 50%; }
    .shape-tr { 
      width: 0; height: 0; 
      border-left: 35px solid transparent; 
      border-right: 35px solid transparent; 
      border-bottom: 65px solid; 
    }
  `]
})
export class AssetComponent {
  @Input() data: any;
  @Input() isSelected: boolean = false;
  @Output() moved = new EventEmitter<any>();

  dragging = false;
  offset = { x: 0, y: 0 };

  onGrab(event: MouseEvent) {
    this.dragging = true;
    this.offset = {
      x: event.clientX - this.data.position.x,
      y: event.clientY - this.data.position.y
    };
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.dragging) {
      this.data.position = {
        x: event.clientX - this.offset.x,
        y: event.clientY - this.offset.y
      };
    }
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    if (this.dragging) {
      this.dragging = false;
      this.moved.emit(this.data.position);
    }
  }
}