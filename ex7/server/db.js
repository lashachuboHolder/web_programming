import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'

const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  waitForConnections: true,
  connectionLimit: 10,
})

export async function initDB() {
  await pool.execute('CREATE DATABASE IF NOT EXISTS ex7_users')
  await pool.execute('USE ex7_users')

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('user', 'admin') DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  const [rows] = await pool.execute('SELECT COUNT(*) as cnt FROM users')
  if (rows[0].cnt === 0) {
    const hashed = bcrypt.hashSync('admin123', 10)
    await pool.execute(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      ['Admin', 'admin@admin.com', hashed, 'admin']
    )
    console.log('Admin user seeded: admin@admin.com / admin123')
  }
}

export const db = {
  async getAllUsers() {
    await pool.execute('USE ex7_users')
    const [rows] = await pool.execute(
      'SELECT id, username, email, role, created_at FROM users ORDER BY id ASC'
    )
    return rows
  },

  async getUserById(id) {
    await pool.execute('USE ex7_users')
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id])
    return rows[0] || null
  },

  async getUserByEmail(email) {
    await pool.execute('USE ex7_users')
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email])
    return rows[0] || null
  },

  async createUser({ username, email, password, role = 'user' }) {
    await pool.execute('USE ex7_users')
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, password, role]
    )
    const [rows] = await pool.execute(
      'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
      [result.insertId]
    )
    return rows[0]
  },

  async updateUser(id, { username, email, password, role }) {
    await pool.execute('USE ex7_users')
    const fields = []
    const values = []
    if (username !== undefined) { fields.push('username = ?'); values.push(username) }
    if (email !== undefined) { fields.push('email = ?'); values.push(email) }
    if (password !== undefined) { fields.push('password = ?'); values.push(password) }
    if (role !== undefined) { fields.push('role = ?'); values.push(role) }
    values.push(id)
    await pool.execute(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values)
    const [rows] = await pool.execute(
      'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
      [id]
    )
    return rows[0]
  },

  async deleteUser(id) {
    await pool.execute('USE ex7_users')
    const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id])
    return result.affectedRows > 0
  },

  async emailExists(email, excludeId = null) {
    await pool.execute('USE ex7_users')
    const [rows] = excludeId
      ? await pool.execute('SELECT id FROM users WHERE email = ? AND id != ?', [email, excludeId])
      : await pool.execute('SELECT id FROM users WHERE email = ?', [email])
    return rows.length > 0
  },
}
