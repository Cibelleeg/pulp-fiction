export class PoliticaDeElegibilidade {
  podeAvaliar(ingressosDoUsuarioNoFilme: { dataSessao: Date }[], agora = new Date()): boolean {
    return ingressosDoUsuarioNoFilme.some((ingresso) => ingresso.dataSessao <= agora);
  }
}
