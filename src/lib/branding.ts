/**
 * Self-contained Branding Registry & Controller for Warborn Cortex
 */

export interface BrandConfig {
  name: string;
  subtitle: string;
  favicon: string;
  logo: string;
  primaryColor: string;
}

export class BrandRegistry {
  public static get(appId?: string): BrandConfig {
    return {
      name: 'Warborn Cortex',
      subtitle: 'Multi-Agent Swarm Orchestration Engine',
      favicon: '/favicon.ico',
      logo: 'WARBORN',
      primaryColor: '#3b82f6',
    };
  }

  public getBrandName(): string {
    return 'Warborn AI';
  }

  public getPrimaryColor(): string {
    return '#3b82f6';
  }
}

export class BrandAnimationController {
  private static sequence = ['W', 'A', 'R', 'B', 'O', 'R', 'N'];
  private static currentIndex = 0;
  private static subscribers: Set<(char: string, index: number) => void> = new Set();
  private static timer: any = null;

  public static getCurrentIndex(): number {
    return BrandAnimationController.currentIndex;
  }

  public static getSequence(): string[] {
    return BrandAnimationController.sequence;
  }

  public static subscribe(callback: (char: string, index: number) => void): () => void {
    BrandAnimationController.subscribers.add(callback);

    if (!BrandAnimationController.timer) {
      BrandAnimationController.timer = setInterval(() => {
        BrandAnimationController.currentIndex =
          (BrandAnimationController.currentIndex + 1) % BrandAnimationController.sequence.length;
        const currentChar = BrandAnimationController.sequence[BrandAnimationController.currentIndex];

        BrandAnimationController.subscribers.forEach((cb) => {
          try {
            cb(currentChar, BrandAnimationController.currentIndex);
          } catch (err) {
            console.error('Brand animation callback error:', err);
          }
        });
      }, 1500);
    }

    return () => {
      BrandAnimationController.subscribers.delete(callback);
      if (BrandAnimationController.subscribers.size === 0 && BrandAnimationController.timer) {
        clearInterval(BrandAnimationController.timer);
        BrandAnimationController.timer = null;
      }
    };
  }

  public getTransitionConfig() {
    return { duration: 0.3, ease: 'easeInOut' };
  }
}
