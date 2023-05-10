import { githubUser } from "./githubUser.js";

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username) {
    try {

      const user = await githubUser.search(username);
      const userExists = this.entries.find(entry => entry.login === username)
      
      if(userExists) {
        throw new Error(`Usuário ${username} já favoritado!`)
      }

      if(user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }
      
      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    } catch (error) {
      alert(error.message)
    }
  }

  delete(user) {
    const filteredEntries = this.entries
    .filter(entry => entry.login !== user.login)
  
    this.entries = filteredEntries
    this.update()
    this.save()
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = document.querySelector('table tbody')

    this.update()
    this.onAdd()
  }

  onAdd() {
    const addButton = this.root.querySelector('.search button')

    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input')
      
      this.add(value)
    }
  }

  update() {
    this.removeAllTr()
   
      this.entries.forEach( user => {
      const row = this.createRow()
      
      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = `/${user.login}`
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers
      row.querySelector('.remove').onclick = () => {
        const confirmDelete = confirm(`Tem certeza que deseja excluir ${user.login} dos favoritos?`)
        if (confirmDelete) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })
  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
      <td class="user">
        <img src="https://github.com/guivieiradm.png" alt="Imagem de usuário">
        <a href="https://github.com/guivieiradm" target="_blank">
          <p>Guilherme Vieira Santos</p>
          <span>guivieiradm</span>
        </a>
      </td>
      <td class="repositories">
        17
      </td>
      <td class="followers">
        0
      </td>
      <td class="action">
        <button class="remove">Remover</button>
      </td>
    `
    return tr
  }

  removeAllTr() {
      this.tbody.querySelectorAll('tr').forEach((tr) => {tr.remove()})
  }
}