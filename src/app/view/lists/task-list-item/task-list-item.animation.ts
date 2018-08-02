import {animate, state, style, transition, trigger} from '@angular/animations';

export enum AnimationState {ACTIVE, INACTIVE }

export const Animations = {
  actionAnimation: trigger('actionAnimation', [
    state(`${AnimationState.INACTIVE}`, style({
      opacity: '0',
      width: '0'
    })),
    state(`${AnimationState.ACTIVE}`, style({
      opacity: '0.6',
      width: '24px'
    })),
    transition(`${AnimationState.INACTIVE} => ${AnimationState.ACTIVE}`, animate('0ms ease-in')),
    transition(`${AnimationState.ACTIVE} => ${AnimationState.INACTIVE}`, animate('0ms ease-out'))
  ])
};
