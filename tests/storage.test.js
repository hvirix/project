const InMemoryRepository = require('../src/storage/InMemoryRepository');

describe('InMemoryRepository', () => {
  let repo;

  beforeEach(() => {
    repo = new InMemoryRepository();
  });

  // --- save() ---
  it('should save an item and return it', () => {
    const item = { id: '1', name: 'Test' };
    const result = repo.save(item);
    expect(result).toEqual(item);
  });

  it('should throw an error when saving an item without id', () => {
    expect(() => repo.save({ name: 'No ID' })).toThrow('Item must have an id');
  });

  it('should throw when id is empty string', () => {
    expect(() => repo.save({ id: '' })).toThrow('Item must have an id');
  });

  it('should overwrite an item with the same id', () => {
    repo.save({ id: '1', value: 'old' });
    repo.save({ id: '1', value: 'new' });
    expect(repo.findById('1').value).toBe('new');
  });

  // --- findById() ---
  it('should find a saved item by id', () => {
    repo.save({ id: '42', data: 'hello' });
    expect(repo.findById('42')).toEqual({ id: '42', data: 'hello' });
  });

  it('should return null when item is not found', () => {
    expect(repo.findById('nonexistent')).toBeNull();
  });

  it('should return null for undefined id lookup', () => {
    expect(repo.findById('missing-key')).toBeNull();
  });

  // --- findAll() ---
  it('should return empty array when repository is empty', () => {
    expect(repo.findAll()).toEqual([]);
  });

  it('should return all saved items', () => {
    repo.save({ id: '1' });
    repo.save({ id: '2' });
    repo.save({ id: '3' });
    expect(repo.findAll().length).toBe(3);
  });

  // --- deleteById() ---
  it('should delete an existing item and return true', () => {
    repo.save({ id: '1' });
    expect(repo.deleteById('1')).toBe(true);
    expect(repo.findById('1')).toBeNull();
  });

  it('should return false when deleting a non-existent item', () => {
    expect(repo.deleteById('ghost')).toBe(false);
  });

  // --- findBy() ---
  it('should find items by predicate', () => {
    repo.save({ id: '1', type: 'A' });
    repo.save({ id: '2', type: 'B' });
    repo.save({ id: '3', type: 'A' });
    const results = repo.findBy(item => item.type === 'A');
    expect(results.length).toBe(2);
    expect(results.every(r => r.type === 'A')).toBe(true);
  });

  it('should return empty array when no items match predicate', () => {
    repo.save({ id: '1', type: 'A' });
    const results = repo.findBy(item => item.type === 'Z');
    expect(results).toEqual([]);
  });

  // --- Boundary: save/findById/deleteById cycle for 50 items ---
  const boundaryIds = Array.from({ length: 50 }, (_, i) => `boundary_${i}`);

  it.each(boundaryIds)('should complete save-find-delete cycle for id=%s', (id) => {
    const item = { id, value: `data_${id}` };
    repo.save(item);
    expect(repo.findById(id)).toEqual(item);
    repo.deleteById(id);
    expect(repo.findById(id)).toBeNull();
  });
});
