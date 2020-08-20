using EComClassLib.Model;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EComClassLib.Repository
{
    public class ArtikelDatabase
    {
        public List<Artikel> Artikels = new List<Artikel>();
        public ArtikelDatabase()
        {
            Artikels.Add(new Artikel("blikjes", 21, 2000, Convert.ToDecimal(4.02), "cola", "cola"));
        }
        public List<Artikel> GetArtikels()
        {
            return Artikels;
        }
    }
}