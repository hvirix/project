class InMemoryRepository {
  constructor() {
    this.data = new Map();
  }

  save(item) {
    if (!item.id) {
      throw new Error('Item must have an id');
    }
    this.data.set(item.id, item);
    return item;
  }

  findById(id) {
    return this.data.get(id) || null;
  }

  findAll() {
    return Array.from(this.data.values());
  }

  deleteById(id) {
    return this.data.delete(id);
  }

  findBy(predicate) {
    return this.findAll().filter(predicate);
  }
}

module.exports = InMemoryRepository;
