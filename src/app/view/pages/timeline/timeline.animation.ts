import {animate, state, style, transition, trigger} from '@angular/animations';

export enum ScrollState {SCROLLING, NON_SCROLLING }

export enum ScrollDirectionState {UP, DOWN }

export const Animations = {
  toolbarAnimation: trigger('toolbarAnimation', [
    state(`${ScrollDirectionState.DOWN}`, style({
      transform: 'translateY(-75px)'
    })),
    state(`${ScrollDirectionState.UP}`, style({
      transform: 'translateY(0px)'
    })),
    transition(`${ScrollDirectionState.DOWN} => ${ScrollDirectionState.UP}`, animate('300ms ease-in')),
    transition(`${ScrollDirectionState.UP} => ${ScrollDirectionState.DOWN}`, animate('300ms ease-out'))
  ]), fabAnimation: trigger('fabAnimation', [
    state(`${ScrollDirectionState.DOWN}`, style({
      transform: 'translateY(75px)'
    })),
    state(`${ScrollDirectionState.UP}`, style({
      transform: 'translateY(0px)'
    })),
    transition(`${ScrollDirectionState.DOWN} => ${ScrollDirectionState.UP}`, animate('300ms ease-in')),
    transition(`${ScrollDirectionState.UP} => ${ScrollDirectionState.DOWN}`, animate('300ms ease-out'))
  ]), dateIndicatorAnimation: trigger('dateIndicatorAnimation', [
    state(`${ScrollState.NON_SCROLLING}`, style({
      opacity: '0'
    })),
    state(`${ScrollState.SCROLLING}`, style({
      opacity: '0.7'
    })),
    transition(`${ScrollState.NON_SCROLLING} => ${ScrollState.SCROLLING}`, animate('300ms ease-in')),
    transition(`${ScrollState.SCROLLING} => ${ScrollState.NON_SCROLLING}`, animate('300ms ease-out'))
  ])
};
