import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import "./AdminBoutique.css";

export default function AdminBoutique() {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("isAdmin") === "true");
  const [password, setPassword] = useState("");
  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState({
    titre: "",
    description: "",
    prix: "",
    type: "vente",
    image: null,
    categorie: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState("");

  const categoriesSuggestions = [
    "Robe", "Corset", "Accessoire", "Cape", "Jupe", "Voile", "Costume", "Autre"
  ];

  useEffect(() => {
    if (isAuthenticated) fetchArticles();
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (password === "dentelle2024") {
      setIsAuthenticated(true);
      localStorage.setItem("isAdmin", "true");
    } else {
      alert("Mot de passe incorrect");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    setIsAuthenticated(false);
    setPassword("");
  };

  const fetchArticles = async () => {
    const { data, error } = await supabase.from("articles").select("*").order("id", { ascending: false });
    if (!error) setArticles(data);
    else console.error("Erreur Supabase :", error.message);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = currentImageUrl;

    if (form.image) {
      const file = form.image;
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase
        .storage
        .from("boutique-images")
        .upload(fileName, file, {
          contentType: file.type,
        });

      if (uploadError) {
        alert("Erreur lors de l'upload de l'image");
        return;
      }

      imageUrl = `https://qhjombqzhpiyqlannvup.supabase.co/storage/v1/object/public/boutique-images/${fileName}`;
    }

    if (editMode) {
      const { error } = await supabase
        .from("articles")
        .update({
          titre: form.titre,
          description: form.description,
          prix: form.prix,
          type: form.type,
          categorie: form.categorie,
          image_url: imageUrl,
        })
        .eq("id", currentId);

      if (!error) {
        resetForm();
        fetchArticles();
      }
    } else {
      const { error } = await supabase.from("articles").insert([
        {
          titre: form.titre,
          description: form.description,
          prix: form.prix,
          type: form.type,
          categorie: form.categorie,
          image_url: imageUrl,
        },
      ]);

      if (!error) {
        resetForm();
        fetchArticles();
      }
    }
  };

  const resetForm = () => {
    setForm({
      titre: "",
      description: "",
      prix: "",
      type: "vente",
      image: null,
      categorie: "",
    });
    setEditMode(false);
    setCurrentId(null);
    setCurrentImageUrl("");
  };

  // ✅ Nouvelle version de suppression
  const handleDelete = async (id) => {
    console.log("Article ID to delete:", id);

    const { data: articleData, error: fetchError } = await supabase
      .from("articles")
      .select("*")
      .eq("id", id);

    if (fetchError) {
      console.error("Erreur lors de la récupération de l'article:", fetchError);
      return;
    }

    if (!articleData || articleData.length === 0) {
      console.log("Aucun article trouvé avec cet ID.");
      return;
    }

    const { error } = await supabase
      .from("articles")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erreur de suppression :", error.message);
      alert("Erreur de suppression : " + error.message);
    } else {
      console.log("Article supprimé avec succès !");
      setArticles((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const handleEdit = (article) => {
    setForm({
      titre: article.titre,
      description: article.description,
      prix: article.prix,
      type: article.type,
      categorie: article.categorie || "",
      image: null,
    });
    setCurrentId(article.id);
    setCurrentImageUrl(article.image_url);
    setEditMode(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <h2>Accès Admin</h2>
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Se connecter</button>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Gérer la Boutique</h2>
        <button className="logout-btn" onClick={handleLogout}>Déconnexion</button>
      </div>

      <div className="admin-grid">
        <form onSubmit={handleSubmit} className="admin-form">
          <input type="text" name="titre" placeholder="Titre" value={form.titre} onChange={handleChange} required />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
          <input type="number" name="prix" placeholder="Prix" value={form.prix} onChange={handleChange} required />
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="vente">Vente</option>
            <option value="location">Location</option>
          </select>

          <input
            list="categories"
            name="categorie"
            placeholder="Catégorie"
            value={form.categorie}
            onChange={handleChange}
          />
          <datalist id="categories">
            {categoriesSuggestions.map((cat, i) => (
              <option key={i} value={cat} />
            ))}
          </datalist>

          <input type="file" name="image" accept="image/*" onChange={handleChange} />
          <button type="submit">{editMode ? "Mettre à jour" : "Ajouter l’article"}</button>
          {editMode && <button type="button" onClick={resetForm}>Annuler</button>}
        </form>

        <div className="article-preview">
          <h3>Aperçu</h3>
          {form.image ? (
            <img src={URL.createObjectURL(form.image)} alt="Nouvelle image" className="preview-image" />
          ) : currentImageUrl ? (
            <img src={currentImageUrl} alt="Image existante" className="preview-image" />
          ) : null}
          <h4>{form.titre || "Titre de l'article"}</h4>
          <p>{form.description || "Description..."}</p>
          <p><strong>{form.prix ? `${form.prix} €` : "Prix"}</strong> — {form.type}</p>
          {form.categorie && <p className="categorie">Catégorie : {form.categorie}</p>}
        </div>
      </div>

      <div className="article-list">
        {articles.map((article) => (
          <div key={article.id} className="article-card">
            {article.image_url && <img src={article.image_url} alt={article.titre} />}
            <h3>{article.titre}</h3>
            <p>{article.description}</p>
            <p><strong>{article.prix} €</strong> - {article.type}</p>
            {article.categorie && <p className="categorie">Catégorie : {article.categorie}</p>}
            <div className="article-actions">
              <button onClick={() => handleEdit(article)}>Modifier</button>
              <button onClick={() => handleDelete(article.id)}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
