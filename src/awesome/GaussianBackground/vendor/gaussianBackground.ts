import { stackBlurCanvasRGB } from './stackBlur';

export interface ColorLayer {
  color: string;
  maxVelocity?: number;
  orbs?: number;
  radius?: number;
  splitX?: number;
  splitY?: number;
}

export interface GaussianBackgroundOptions {
  blurRadius?: number;
  fpsCap?: number;
  scale?: number;
}

type Layer = {
  color: string;
  context: CanvasRenderingContext2D;
  orbs: Orb[];
};

type Orb = {
  maxX: number;
  maxY: number;
  minX: number;
  minY: number;
  posX: number;
  posY: number;
  radius: number;
  velX: number;
  velY: number;
};

class GaussianBackground {
  private fpsAverage?: number;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private animationFrame: number | null = null;
  private timestep = 0;
  private firstCallTime = 0;
  private lastCallTime = 0;
  private timeElapsed = 0;
  private fpsTotal = 0;
  private layers: Layer[] = [];
  private options = {
    blurRadius: 16,
    fpsCap: 30,
    height: 32,
    scale: 20,
    width: 64,
  };

  constructor(node: HTMLCanvasElement, options?: GaussianBackgroundOptions) {
    this.canvas = node;
    this.context = this.canvas.getContext('2d')!;
    if (!this.context) {
      throw new Error('ERROR: Could not load canvas');
    }
    if (options) {
      this.updateOptions(options);
    }
  }

  run(layers: ColorLayer[]) {
    this.updateLayers(layers);

    this.firstCallTime = Date.now();
    this.lastCallTime = this.firstCallTime;

    if (this.animationFrame) window.cancelAnimationFrame(this.animationFrame);
    this.animationFrame = window.requestAnimationFrame(this.displayLoop.bind(this));

    this.play();
  }

  private generateLayer(
    { orbs = 0, radius = 0, maxVelocity = 0, color, splitX, splitY }: ColorLayer,
    index: number,
  ): Layer {
    const canvas = document.createElement('canvas');

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error(`Failed to get 2D context for layer ${index}`);
    }

    const layerOrbs: Orb[] = [];
    for (let i = 0; i < orbs; i++) {
      const orb = this.createOrb(radius, maxVelocity, splitX, splitY);
      layerOrbs.push(orb);
    }

    return { color, context, orbs: layerOrbs };
  }

  private createOrb(radius: number, maxVelocity: number, splitX?: number, splitY?: number): Orb {
    const optionsWidth = this.options.width;
    const optionsHeight = this.options.height;
    const posX = splitX ? Math.random() * (optionsWidth / splitX) : Math.random() * optionsWidth;
    const posY = splitY ? Math.random() * (optionsHeight / splitY) : Math.random() * optionsHeight;

    return {
      maxX: optionsWidth,
      maxY: optionsHeight,
      minX: 0,
      minY: 0,
      posX,
      posY,
      radius,
      velX: (Math.random() - 0.5) * 2 * maxVelocity,
      velY: (Math.random() - 0.5) * 2 * maxVelocity,
    };
  }
  private displayLoop() {
    // Keep going if the user wants animation
    this.animationFrame = window.requestAnimationFrame(this.displayLoop.bind(this));

    const currentTime = Date.now();
    const delta = currentTime - this.lastCallTime;

    // Ignore timesteping code if there is no animation
    if (delta > this.timestep) {
      this.lastCallTime = currentTime - (delta % this.timestep);
      this.timeElapsed = this.lastCallTime - this.firstCallTime;

      this.fpsTotal++;
      this.fpsAverage = this.fpsTotal / (this.timeElapsed / 1000);

      this.drawBackground();

      this.drawBlur();
    }
  }

  drawBackground() {
    for (let i = Object.keys(this.layers).length - 1; i >= 0; i--) {
      const layerContext = this.layers[i].context;
      const layerOrbs = this.layers[i].orbs;

      // Draw background
      layerContext.fillStyle = this.layers[i].color;
      layerContext.fillRect(0, 0, this.options.width, this.options.height);

      // Draw animated layer elements
      for (let x = Object.keys(layerOrbs).length - 1; x >= 0; x--) {
        // Animate the movement
        layerOrbs[x].posX += layerOrbs[x].velX;
        layerOrbs[x].posY += layerOrbs[x].velY;

        // Check if the orb has custom boundaries
        let minX;
        let maxX;
        let minY;
        let maxY;
        if (layerOrbs[x].maxX && layerOrbs[x].maxY) {
          minX = layerOrbs[x].minX;
          maxX = layerOrbs[x].maxX;

          minY = layerOrbs[x].minY;
          maxY = layerOrbs[x].maxY;
        } else {
          minX = 0;
          maxX = this.options.width;

          minY = 0;
          maxY = this.options.height;
        }

        // Collision detection and correction
        if (layerOrbs[x].posX >= maxX) {
          layerOrbs[x].posX = maxX;
          layerOrbs[x].velX = -layerOrbs[x].velX;
        } else if (layerOrbs[x].posX <= minX) {
          layerOrbs[x].posX = minX;
          layerOrbs[x].velX = -layerOrbs[x].velX;
        }

        if (layerOrbs[x].posY >= maxY) {
          layerOrbs[x].posY = maxY;
          layerOrbs[x].velY = -layerOrbs[x].velY;
        } else if (layerOrbs[x].posY <= minY) {
          layerOrbs[x].posY = minY;
          layerOrbs[x].velY = -layerOrbs[x].velY;
        }

        layerContext.save();
        layerContext.globalCompositeOperation = 'destination-out';
        layerContext.beginPath();
        layerContext.arc(
          layerOrbs[x].posX,
          layerOrbs[x].posY,
          layerOrbs[x].radius,
          0,
          2 * Math.PI,
          false,
        );
        layerContext.fill();
        layerContext.restore();
      }

      // Draw the virtual canvas layer onto the main canvas
      this.context.drawImage(layerContext.canvas, 0, 0);
    }
  }

  private drawBlur() {
    stackBlurCanvasRGB(
      this.canvas,
      0,
      0,
      this.options.width,
      this.options.height,
      this.options.blurRadius,
    );
  }

  private updateLayers(layers: ColorLayer[]) {
    this.layers = layers.map((layer, index) => this.generateLayer(layer, index));
  }

  public updateOptions({
    blurRadius = 16,
    fpsCap = 30,
    scale = 20,
  }: Partial<GaussianBackgroundOptions>) {
    this.options = { ...this.options, blurRadius, fpsCap, scale };
    this.options.height = Math.round(this.canvas.clientHeight / this.options.scale);
    this.options.width = Math.round(this.canvas.clientWidth / this.options.scale);
    this.timestep = 1000 / this.options.fpsCap;
    this.context.canvas.width = this.options.width;
    this.context.canvas.height = this.options.height;
  }

  prototype() {
    window.cancelAnimationFrame(this.animationFrame!);
  }

  public play() {
    window.cancelAnimationFrame(this.animationFrame!);
    this.animationFrame = window.requestAnimationFrame(() => this.displayLoop());
  }
}

export default GaussianBackground;
