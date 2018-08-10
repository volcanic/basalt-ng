import {animate, state, style, transition, trigger} from '@angular/animations';

export enum ScrollState {SCROLLING, NON_SCROLLING }

export enum ScrollDirection {UP, DOWN }

export const Animations = {
  toolbarAnimation: trigger('toolbarAnimation', [
    state(`${ScrollDirection.DOWN}`, style({
      transform: 'translateY(-75px)'
    })),
    state(`${ScrollDirection.UP}`, style({
      transform: 'translateY(0px)'
    })),
    transition(`${ScrollDirection.DOWN} => ${ScrollDirection.UP}`, animate('300ms ease-in')),
    transition(`${ScrollDirection.UP} => ${ScrollDirection.DOWN}`, animate('300ms ease-out'))
  ]), fabAnimation: trigger('fabAnimation', [
    state(`${ScrollDirection.DOWN}`, style({
      transform: 'translateY(75px)'
    })),
    state(`${ScrollDirection.UP}`, style({
      transform: 'translateY(0px)'
    })),
    transition(`${ScrollDirection.DOWN} => ${ScrollDirection.UP}`, animate('300ms ease-in')),
    transition(`${ScrollDirection.UP} => ${ScrollDirection.DOWN}`, animate('300ms ease-out'))
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
