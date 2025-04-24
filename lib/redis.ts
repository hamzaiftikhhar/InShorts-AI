// Mock Redis implementation
class MockRedis {
  private cache: Record<string, any> = {}

  async get<T>(key: string): Promise<T | null> {
    return this.cache[key] || null
  }

  async set(key: string, value: any, options?: { ex?: number }): Promise<"OK"> {
    this.cache[key] = value
    return "OK"
  }

  async hget(key: string, field: string): Promise<any> {
    const hash = this.cache[key] || {}
    return hash[field] || null
  }

  async hset(key: string, fieldOrObject: string | Record<string, any>, value?: any): Promise<number> {
    if (!this.cache[key]) {
      this.cache[key] = {}
    }

    if (typeof fieldOrObject === "string") {
      this.cache[key][fieldOrObject] = value
      return 1
    } else {
      Object.entries(fieldOrObject).forEach(([field, val]) => {
        this.cache[key][field] = val
      })
      return Object.keys(fieldOrObject).length
    }
  }

  async hdel(key: string, field: string): Promise<number> {
    if (!this.cache[key]) return 0

    const existed = field in this.cache[key]
    delete this.cache[key][field]
    return existed ? 1 : 0
  }

  async hgetall(key: string): Promise<Record<string, any> | null> {
    return this.cache[key] || null
  }
}

export const kv = new MockRedis()
