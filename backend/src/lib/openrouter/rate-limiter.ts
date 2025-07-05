export class TokenBucketRateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly maxTokens: number;
  private readonly refillRate: number;
  private readonly refillInterval: number;

  constructor(
    maxTokens: number = 100,
    refillRate: number = 10,
    refillInterval: number = 1000
  ) {
    this.maxTokens = maxTokens;
    this.refillRate = refillRate;
    this.refillInterval = refillInterval;
    this.tokens = maxTokens;
    this.lastRefill = Date.now();
  }

  async acquireToken(): Promise<void> {
    await this.refillTokens();
    
    if (this.tokens <= 0) {
      const waitTime = this.calculateWaitTime();
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return this.acquireToken();
    }
    
    this.tokens--;
  }

  private async refillTokens(): Promise<void> {
    const now = Date.now();
    const timePassed = now - this.lastRefill;
    const tokensToAdd = Math.floor(timePassed / this.refillInterval) * this.refillRate;
    
    if (tokensToAdd > 0) {
      this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
      this.lastRefill = now;
    }
  }

  private calculateWaitTime(): number {
    const tokensNeeded = 1;
    const refillsNeeded = Math.ceil(tokensNeeded / this.refillRate);
    return refillsNeeded * this.refillInterval;
  }
} 