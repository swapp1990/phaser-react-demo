import store from "../../stores";
import Item from "./Item";
import {
  openComputerDialog,
  closeComputerDialog,
} from "../../stores/ComputerStore";

export default class Computer extends Item {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);
  }

  onOverlapDialog() {
    this.setDialogBox("Press R to use computer");
  }

  openDialog() {
    console.log("openDialog");
    store.dispatch(openComputerDialog({}));
  }

  closeDialog() {
    store.dispatch(closeComputerDialog({}));
  }
}
