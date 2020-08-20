
using EComClassLib.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EComClassLib.Model
{
    public class WinkelMand
    {
        public IList<WinkelMandDetail> Artikels { get; set; }
    
        public WinkelMand()
        {

        }
        //WinkelMand(ttHfakRow) { }
        public void VoegArtikelToe(ArtikelDatabase artikelDatabase, string naam, decimal aantal)
        {
            
            var artikels = artikelDatabase.GetArtikels();
            var winkelmandDetail = new WinkelMandDetail();
            var naam1 = naam.Substring(1, naam.Length - 2).ToUpper();
            winkelmandDetail.Artikel = artikels.Where(x => x.Naam.ToUpper().Contains(naam1.ToUpper())).FirstOrDefault();
            winkelmandDetail.Hoeveelheid = aantal;
            if (this.Artikels == null)
            {
                this.Artikels = new List<WinkelMandDetail>();
            }
            this.Artikels.Add(winkelmandDetail);
        }
    }
}