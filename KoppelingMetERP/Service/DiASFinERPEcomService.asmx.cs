using Google.Cloud.Dialogflow.V2;
using Google.Protobuf;
using System.Web.Services;
using System.Web.Mvc;
using System.Text;
using System.IO;
using System.Web;
using Google.Protobuf.WellKnownTypes;
using Newtonsoft.Json;
using EComClassLib.Model;
using System.Collections.Generic;
using EComClassLib.Repository;
using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Service
{
    [WebService(Namespace = "https://localhost:44371/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class DiAsFinERPEcomService : System.Web.Services.WebService
    {
        private ArtikelDatabase artikelRepository = new ArtikelDatabase();
        private WinkelMand WinkelMand = new WinkelMand();
        private static readonly JsonParser jsonParser = 
            new JsonParser(JsonParser.Settings.Default.WithIgnoreUnknownFields(true));
        private StringBuilder sb = new StringBuilder();
        [WebMethod]
        [HttpPost]
        public string ReadWebhookRequest()
        {
            var request = HttpContext.Current.Request;
            WebhookRequest webhook;
            using (var stream = new MemoryStream())
            {
                request.InputStream.Seek(0, SeekOrigin.Begin);
                request.InputStream.CopyTo(stream);
                var notification = Encoding.UTF8.GetString(stream.ToArray());
                webhook = jsonParser.Parse<WebhookRequest>(notification);
            }
            var intent = webhook.QueryResult.Intent.DisplayName;
            var parameters = webhook.QueryResult.Parameters;
            ChooseMethod(intent, parameters);
            return WebhookResponse();
        }
        private void ChooseMethod(string naamIntent, Struct parameters)
        {
            switch(naamIntent)
            {
                case "PlaatsWinkelMand":
                    sb.Append(PlaatsWinkelMand());
                    break;
                case "VoegToeAanWinkelmand":
                    var aantal = parameters.Fields["aantal"];
                    sb.Append(VoegArtikelToe(Convert.ToDecimal(aantal.ToString()), parameters.Fields["naam"].ToString()));
                    break;
                case "HerhaalWinkelMand":
                    HerhaalWinkelMand();
                    break;
            }
        }
        private string VoegArtikelToe(decimal aantal, string naam)
        {
            WinkelMand.VoegArtikelToe(artikelRepository, naam, aantal);
            return "Artikel is toegevoegd";
        }
        private void HerhaalWinkelMand()
        {

            sb.Append("12 blikjes cola voor 4.20");
        }
        private string WebhookResponse()
        {
            var res = new WebhookResponse();
            res.FulfillmentText = sb.ToString();
            Context.Response.Output.Write(res.ToString());
            return res.ToString();
        }
        private string PlaatsWinkelMand()
        {
            return "Bestelling is geplaatst";
        }
    }
}
