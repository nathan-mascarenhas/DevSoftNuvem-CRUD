import React, { useState, useEffect } from 'react';
import './App.css';
import Parse from "parse/dist/parse.min.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

//Back4App
const app_id = process.env.REACT_APP_PARSE_APP_ID;
const host_url = process.env.REACT_APP_PARSE_HOST_URL;
const javascript_key = process.env.REACT_APP_PARSE_JAVASCRIPT_KEY;
Parse.initialize(app_id, javascript_key);
Parse.serverURL = host_url;

function App() {
  //STATES
  const [comics, setComics] = useState([]);
  const [newComicId, setNewComicId] = useState('');
  const [newComicName, setNewComicName] = useState('');
  const [newComicPublisher, setNewComicPublisher] = useState('');
  const [newComicYear, setNewComicYear] = useState('');
  const [newComicCompany, setNewComicCompany] = useState('');
  const [display, setDisplay] = useState(false)

  //READ
  const fetchAllComics = async () => {
    try {
      const query = new Parse.Query("comics")
      const allComics = await query.find()
      setComics(allComics)
    } catch (error) {
      console.error('Erro na requisição:', error)
    }
  };

  //CREATE
  const createComic = async () => {
    let Comics = new Parse.Object('comics')
    Comics.set('name', newComicName)
    Comics.set('publisher', newComicPublisher)
    Comics.set('year', newComicYear)
    Comics.set('company', newComicCompany)
    try {
      await Comics.save()
      fetchAllComics()
    } catch (error) { 
      alert('Erro na criação:', error)
    };
  }

  //UPDATE
  const updateComic = async function (comicId) {
    let Comics = new Parse.Object('comics');
    Comics.set('objectId', comicId);
    Comics.set('name', newComicName)
    Comics.set('publisher', newComicPublisher)
    Comics.set('year', newComicYear)
    Comics.set('company', newComicCompany)
    try {
      await Comics.save();
    } catch (error) {
      alert('Erro na atualização:', error)
    };
  };

  //DELETE
  const deleteComic = async function (comicId) {
    const Comics = new Parse.Object('comics');
    Comics.set('objectId', comicId);
    try {
      await Comics.destroy();
      fetchAllComics();
    } catch (error) {
      alert('Erro ao apagar:', error)
    };
  };

  //LIMPEZA DE CAMPOS
  const clearFields = () => {
    setNewComicId('')
    setNewComicName('')
    setNewComicPublisher('')
    setNewComicYear('')
    setNewComicCompany('')
  }

  //EDIT FORM
  const editForm = (item) => {
    setNewComicId(item.id)
    setNewComicName(item.get('name'))
    setNewComicPublisher(item.get('publshier'))
    setNewComicYear(item.get('year'))
    setNewComicCompany(item.get('company'))
  }

  useEffect(() => {
    fetchAllComics();
  }, []);

  return (
    <div className="app-container">
      <header>
        <div className="banner">
          <h1>Catálogo de Quadrinhos</h1>
        </div>
      </header>
      <main>
        {display && 
          <form onSubmit={(e) => {
            if(newComicId){
              updateComic(newComicId)
              e.preventDefault();
              clearFields()
              setDisplay(false)
            }else{
              createComic()
              e.preventDefault();
              clearFields()
              setDisplay(false)
            } 
          }}>
            <input required type="text" placeholder="Nome" value={newComicName} onChange={(e) => setNewComicName(e.target.value)} />
            <input required type="text" placeholder="Editora" value={newComicPublisher} onChange={(e) => setNewComicPublisher(e.target.value)} />
            <input required type="text" placeholder="Ano" value={newComicYear} onChange={(e) => setNewComicYear(e.target.value)} />
            <input required type="text" placeholder="Empresa" value={newComicCompany} onChange={(e) => setNewComicCompany(e.target.value)} />
            <div className="button-group">
              <button type="button" onClick={() => setDisplay(false)}>Cancelar</button>
              <button type="submit">Salvar</button>
            </div>
          </form>
        }

        {!display &&
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Editora</th>
                <th>Ano</th>
                <th>Empresa</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {comics.map(comic => (
                <tr key={comic.id}>
                  <td>{comic.get('name')}</td>
                  <td>{comic.get('publisher')}</td>
                  <td>{comic.get('year')}</td>
                  <td>{comic.get('company')}</td>
                  <td>
                    <div className="action-buttons">
                      <button className='edit-button' alt="Editar" onClick={() => [setDisplay(true), editForm(comic)]}>
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button className='delete-button' alt="Apagar" onClick={() => deleteComic(comic.id)}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </main>

      {/* Botão Flutuante para criação de novo item */}
      <button className="fab" onClick={() => setDisplay(!display)}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  );
}

export default App;
