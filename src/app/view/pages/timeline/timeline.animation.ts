import {animate, state, style, transition, trigger} from '@angular/animations';

export enum AnimationState {ACTIVE, INACTIVE }

export const Animations = {
  toolbarAnimation: trigger('toolbarAnimation', [
    state(`${AnimationState.INACTIVE}`, style({
      transform: 'translateY(-75px)'
    })),
    state(`${AnimationState.ACTIVE}`, style({
      transform: 'translateY(0px)'
    })),
    transition(`${AnimationState.INACTIVE} => ${AnimationState.ACTIVE}`, animate('300ms ease-in')),
    transition(`${AnimationState.ACTIVE} => ${AnimationState.INACTIVE}`, animate('300ms ease-out'))
  ]), fabAnimation: trigger('fabAnimation', [
    state(`${AnimationState.INACTIVE}`, style({
      transform: 'translateY(75px)'
    })),
    state(`${AnimationState.ACTIVE}`, style({
      transform: 'translateY(0px)'
    })),
    transition(`${AnimationState.INACTIVE} => ${AnimationState.ACTIVE}`, animate('300ms ease-in')),
    transition(`${AnimationState.ACTIVE} => ${AnimationState.INACTIVE}`, animate('300ms ease-out'))
  ])
};
