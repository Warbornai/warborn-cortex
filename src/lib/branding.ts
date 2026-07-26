/**
 * Self-contained Branding Registry & Controller for Warborn Cortex
 */

export class BrandRegistry {
  public getBrandName(): string {
    return 'Warborn AI';
  }

  public getPrimaryColor(): string {
    return '#3b82f6';
  }
}

export class BrandAnimationController {
  public getTransitionConfig() {
    return { duration: 0.3, ease: 'easeInOut' };
  }
}
