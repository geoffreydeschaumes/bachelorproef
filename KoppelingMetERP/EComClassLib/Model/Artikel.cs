using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EComClassLib.Model
{
    public class Artikel
    {
        public Artikel(string Aard, decimal BTW, decimal Voorraad, decimal Prijs, string Merk, string Naam)
        {
            this.Aard = Aard; 
            this.BTW = BTW;
            this.Prijs = Prijs;
            this.Merk = Merk;
            this.Naam = Naam;
            this.Voorraad = Voorraad;
        }
        public string Aard { get; set; }
        public ICollection<Artikel> AlternatieveArtikels { get; set; }
        public decimal BTW { get; set; }
        public bool HeeftPrijs { get; set; }
        public string Merk { get; set; }
        public string Naam { get; set; }
        public decimal Voorraad { get; set; }
        public decimal Prijs { get; set; }
        public int PrijsDecimalen { get; set; }
        public Artikel() { }
    }
}