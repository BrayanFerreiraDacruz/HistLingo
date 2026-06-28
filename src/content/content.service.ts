import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContentService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedContent();
  }

  private async seedContent() {
    const modulesData = [
      { order: 1, title: 'Raízes Profundas', description: 'Povos Originários: Cultura indígena antes de 1500, troncos linguísticos, organização social e mitologias.' },
      { order: 2, title: 'O Encontro e o Choque', description: 'Período Colonial Inicial: Chegada dos portugueses, ciclos econômicos (pau-brasil, açúcar) e resistência indígena/africana.' },
      { order: 3, title: 'Brasil Império', description: 'Independência e Monarquia: A vinda da Família Real, D. Pedro I e II, Abolição e a transição para a República.' },
      { order: 4, title: 'Ordem e Progresso?', description: 'República Velha e Era Vargas: Coronelismo, movimentos sociais (Canudos, Vacina) e a industrialização.' },
      { order: 5, title: 'Tempos Modernos', description: 'Ditadura e Redemocratização: O golpe de 64, movimentos de resistência, Diretas Já e a Constituição de 88.' },
    ];

    const modules: Record<number, { id: string }> = {};
    for (const modData of modulesData) {
      modules[modData.order] = await this.prisma.module.upsert({
        where: { order: modData.order },
        update: { title: modData.title, description: modData.description },
        create: { title: modData.title, description: modData.description, order: modData.order },
      });
    }

    const lessonsData = [
      // Module 1
      { id: 'l-1-1', moduleOrder: 1, order: 1, title: 'Os Primeiros Habitantes', xpReward: 15,
        content: 'Antes de 1500, o Brasil abrigava entre 2 e 5 milhões de indígenas, divididos em centenas de etnias. Os Tupi ocupavam o litoral, os Macro-Jê o interior do planalto central. Cada grupo tinha língua, religião e organização social próprias.' },
      { id: 'l-1-2', moduleOrder: 1, order: 2, title: 'Sociedade e Cultura Indígena', xpReward: 20,
        content: 'A sociedade indígena era organizada em aldeias (tabas), chefiadas por um cacique. A espiritualidade era central: pajés comunicavam-se com os espíritos. A cerâmica marajoara, as pinturas rupestres e os rituais demonstram a riqueza cultural desses povos.' },
      { id: 'l-1-3', moduleOrder: 1, order: 3, title: 'Troncos Linguísticos', xpReward: 20,
        content: 'Existem dois grandes troncos linguísticos: Tupi (falado no litoral e Amazônia) e Macro-Jê (planalto). O Tupi foi tão importante que virou a "língua geral" do Brasil colonial. Muitas palavras do português brasileiro vêm do Tupi: abacaxi, jaguar, mandioca, pipoca.' },
      // Module 2
      { id: 'l-2-1', moduleOrder: 2, order: 1, title: 'A Chegada dos Portugueses', xpReward: 15,
        content: 'Em 22 de abril de 1500, Pedro Álvares Cabral chegou ao Brasil com uma frota de 13 navios. O primeiro contato com os Tupinambá foi pacífico. Pero Vaz de Caminha escreveu a famosa carta ao rei D. Manuel descrevendo a terra e seus habitantes. O Brasil foi chamado inicialmente de "Ilha de Vera Cruz".' },
      { id: 'l-2-2', moduleOrder: 2, order: 2, title: 'O Ciclo do Pau-Brasil', xpReward: 20,
        content: 'O pau-brasil foi a primeira riqueza explorada pelos portugueses. A madeira vermelha era usada como tintura na Europa. O trabalho era feito pelos indígenas no sistema de escambo: em troca de machados e espelhos, eles derrubavam as árvores. O nome "Brasil" vem dessa madeira.' },
      { id: 'l-2-3', moduleOrder: 2, order: 3, title: 'A Escravidão Africana', xpReward: 25,
        content: 'Com a expansão do açúcar, Portugal passou a trazer africanos escravizados a partir de 1549. Estima-se que 4 a 5 milhões de africanos foram trazidos ao Brasil até 1850. Os quilombos, como Palmares (liderado por Zumbi), foram formas de resistência. A mistura cultural africana moldou profundamente a identidade brasileira.' },
      // Module 3
      { id: 'l-3-1', moduleOrder: 3, order: 1, title: 'A Vinda da Família Real', xpReward: 15,
        content: 'Em 1808, a família real portuguesa fugiu de Napoleão e veio para o Brasil com cerca de 15 mil pessoas. D. João VI abriu os portos às nações amigas, transformando o Rio de Janeiro na capital do Império Português. Foram criados tribunais, a Imprensa Régia e o Banco do Brasil.' },
      { id: 'l-3-2', moduleOrder: 3, order: 2, title: 'Independência do Brasil', xpReward: 25,
        content: 'Em 7 de setembro de 1822, às margens do Rio Ipiranga em São Paulo, D. Pedro I proclamou a Independência do Brasil com o famoso "Fico". O Brasil tornou-se uma monarquia independente. A luta pela independência envolveu batalhas, especialmente na Bahia, onde tropas brasileiras e mercenários expulsaram os portugueses.' },
      { id: 'l-3-3', moduleOrder: 3, order: 3, title: 'A Abolição da Escravatura', xpReward: 30,
        content: 'A Lei Áurea, assinada pela Princesa Isabel em 13 de maio de 1888, aboliu a escravidão no Brasil. O país foi o último das Américas a abolir o trabalho escravo. O movimento abolicionista teve figuras como Joaquim Nabuco e José do Patrocínio. A abolição sem reforma agrária deixou os ex-escravizados sem condições de sobrevivência.' },
      // Module 4
      { id: 'l-4-1', moduleOrder: 4, order: 1, title: 'Proclamação da República', xpReward: 15,
        content: 'Em 15 de novembro de 1889, o Marechal Deodoro da Fonseca proclamou a República no Brasil. A Monarquia caiu sem resistência. Os primeiros anos republicanos foram marcados por instabilidade: a "República da Espada" e depois a República Velha (1889-1930), dominada pelos estados de São Paulo e Minas Gerais.' },
      { id: 'l-4-2', moduleOrder: 4, order: 2, title: 'A Guerra de Canudos', xpReward: 25,
        content: 'Entre 1896 e 1897, o arraial de Canudos (BA), liderado por Antônio Conselheiro, resistiu a quatro expedições militares. Com quase 30 mil habitantes, era a segunda maior cidade da Bahia. O governo considerava o movimento monarquista e religioso uma ameaça. A guerra terminou com o massacre de toda a população. O escritor Euclides da Cunha imortalizou o conflito em "Os Sertões".' },
      { id: 'l-4-3', moduleOrder: 4, order: 3, title: 'Era Vargas', xpReward: 25,
        content: 'Getúlio Vargas governou o Brasil por 15 anos (1930-1945 e 1951-1954). Criou a CLT (Consolidação das Leis do Trabalho), o salário mínimo e a Petrobrás. O Estado Novo (1937-1945) foi um período ditatorial. Vargas se suicidou em 1954 com uma carta famosa: "Saio da vida para entrar na História".' },
      // Module 5
      { id: 'l-5-1', moduleOrder: 5, order: 1, title: 'O Golpe Militar de 1964', xpReward: 20,
        content: 'Em 31 de março de 1964, um golpe militar depôs o presidente João Goulart. Os militares governaram o Brasil por 21 anos (1964-1985). O AI-5 (1968) foi o ato mais duro: suspendeu direitos políticos, fechou o Congresso e instaurou a censura. A resistência incluiu guerrilha armada, movimentos estudantis e culturais.' },
      { id: 'l-5-2', moduleOrder: 5, order: 2, title: 'Redemocratização e Diretas Já', xpReward: 25,
        content: 'Em 1984, o movimento "Diretas Já" mobilizou milhões de brasileiros pedindo eleições diretas para presidente. A emenda Dante de Oliveira foi rejeitada, mas a pressão popular foi fundamental. Em 1985, Tancredo Neves foi eleito indiretamente, mas morreu antes de assumir. José Sarney governou na transição. Em 1988, a Constituição Cidadã foi promulgada.' },
      { id: 'l-5-3', moduleOrder: 5, order: 3, title: 'A Constituição de 1988', xpReward: 30,
        content: 'A Constituição Federal de 1988, chamada "Constituição Cidadã" por Ulysses Guimarães, garantiu direitos fundamentais: saúde, educação, moradia, lazer. Criou o SUS (Sistema Único de Saúde), o Estatuto da Criança e do Adolescente e proteções trabalhistas. É considerada uma das constituições mais avançadas do mundo em direitos sociais.' },
    ];

    for (const l of lessonsData) {
      const mod = modules[l.moduleOrder];
      await this.prisma.lesson.upsert({
        where: { id: l.id },
        update: { title: l.title, content: l.content, xpReward: l.xpReward },
        create: { id: l.id, moduleId: mod.id, order: l.order, title: l.title, content: l.content, xpReward: l.xpReward },
      });
    }

    const challengesData = [
      // Lesson l-1-1
      { id: 'c-1-1-1', lessonId: 'l-1-1', type: 'WHO_AM_I' as const,
        content: 'Sou um dos maiores troncos linguísticos do Brasil. Meus povos habitavam o litoral e foram os primeiros a encontrar os portugueses. Muitas palavras do português vêm de mim, como "abacaxi" e "jaguar". Quem sou eu?',
        options: ['Tupi', 'Macro-Jê', 'Arawak', 'Carib'], correctAnswer: 'Tupi',
        explanation: 'O tronco Tupi habitava o litoral e deu origem à Língua Geral colonial.' },
      { id: 'c-1-1-2', lessonId: 'l-1-1', type: 'WORKS_AND_RELICS' as const,
        content: 'Qual era a principal forma de organização social dos povos indígenas brasileiros?',
        options: ['Aldeias (tabas) lideradas por caciques', 'Cidades-estado com reis absolutos', 'Nômades sem liderança fixa', 'Impérios centralizados'],
        correctAnswer: 'Aldeias (tabas) lideradas por caciques',
        explanation: 'Os indígenas viviam em aldeias chamadas tabas, lideradas por caciques.' },
      { id: 'c-1-1-3', lessonId: 'l-1-1', type: 'TIMELINE' as const,
        content: 'Quantos indígenas estima-se que viviam no Brasil antes da chegada dos europeus?',
        options: ['2 a 5 milhões', 'Menos de 500 mil', 'Mais de 50 milhões', 'Cerca de 100 mil'],
        correctAnswer: '2 a 5 milhões',
        explanation: 'Estima-se que entre 2 e 5 milhões de indígenas habitavam o Brasil em 1500.' },
      // Lesson l-1-2
      { id: 'c-1-2-1', lessonId: 'l-1-2', type: 'WHO_AM_I' as const,
        content: 'Sou o líder espiritual das aldeias indígenas. Comunico-me com os espíritos e faço rituais de cura. Sou considerado um intermediário entre o mundo dos vivos e dos mortos. Quem sou eu?',
        options: ['Pajé', 'Cacique', 'Guerreiro', 'Artesão'],
        correctAnswer: 'Pajé',
        explanation: 'O pajé era o líder espiritual, responsável pelos rituais e cura nas aldeias.' },
      { id: 'c-1-2-2', lessonId: 'l-1-2', type: 'WORKS_AND_RELICS' as const,
        content: 'A cerâmica marajoara é uma importante manifestação artística dos povos indígenas. Onde foi produzida?',
        options: ['Ilha de Marajó (PA)', 'Serra da Capivara (PI)', 'Litoral de São Paulo', 'Chapada Diamantina (BA)'],
        correctAnswer: 'Ilha de Marajó (PA)',
        explanation: 'A cerâmica marajoara foi produzida na Ilha de Marajó, no Pará, e é famosa por suas decorações geométricas.' },
      // Lesson l-1-3
      { id: 'c-1-3-1', lessonId: 'l-1-3', type: 'WORKS_AND_RELICS' as const,
        content: 'Qual palavra do português brasileiro NÃO tem origem no Tupi?',
        options: ['Feijoada', 'Abacaxi', 'Mandioca', 'Pipoca'],
        correctAnswer: 'Feijoada',
        explanation: 'Feijoada vem do português "feijão". Abacaxi, mandioca e pipoca são palavras de origem Tupi.' },
      { id: 'c-1-3-2', lessonId: 'l-1-3', type: 'WHO_AM_I' as const,
        content: 'Sou a língua que se tornou a "língua geral" do Brasil colonial. Fui usada por missionários para catequizar indígenas. Venho do tronco Tupi. O que sou?',
        options: ['Nheengatu', 'Guarani', 'Caingangue', 'Yanomami'],
        correctAnswer: 'Nheengatu',
        explanation: 'O Nheengatu (língua geral) foi amplamente usado no período colonial como língua franca.' },
      // Lesson l-2-1
      { id: 'c-2-1-1', lessonId: 'l-2-1', type: 'TIMELINE' as const,
        content: 'Em que data Pedro Álvares Cabral chegou ao Brasil?',
        options: ['22 de abril de 1500', '12 de outubro de 1492', '7 de setembro de 1822', '15 de novembro de 1889'],
        correctAnswer: '22 de abril de 1500',
        explanation: 'Cabral chegou em 22 de abril de 1500, na região que hoje é Porto Seguro, Bahia.' },
      { id: 'c-2-1-2', lessonId: 'l-2-1', type: 'WHO_AM_I' as const,
        content: 'Sou o escrivão da frota de Cabral. Escrevi uma carta famosa descrevendo as terras e os povos encontrados no Brasil. Minha carta é o mais antigo documento sobre o Brasil. Quem sou eu?',
        options: ['Pero Vaz de Caminha', 'Américo Vespúcio', 'Fernão de Magalhães', 'Bartolomeu Dias'],
        correctAnswer: 'Pero Vaz de Caminha',
        explanation: 'Pero Vaz de Caminha escreveu a "Carta do Achamento do Brasil" ao rei D. Manuel I.' },
      // Lesson l-2-2
      { id: 'c-2-2-1', lessonId: 'l-2-2', type: 'WORKS_AND_RELICS' as const,
        content: 'Qual era o sistema de trabalho usado pelos indígenas no início da exploração do pau-brasil?',
        options: ['Escambo', 'Escravidão forçada', 'Pagamento em ouro', 'Servidão feudal'],
        correctAnswer: 'Escambo',
        explanation: 'No sistema de escambo, os indígenas recebiam objetos (machados, espelhos) em troca do pau-brasil.' },
      { id: 'c-2-2-2', lessonId: 'l-2-2', type: 'WHO_AM_I' as const,
        content: 'Sou uma madeira que dou nome a um país. Minha cor vermelha era usada para tingir tecidos na Europa. Fui a primeira riqueza explorada pelos portugueses no Brasil. O que sou?',
        options: ['Pau-brasil', 'Mogno', 'Cedro', 'Jacarandá'],
        correctAnswer: 'Pau-brasil',
        explanation: 'O pau-brasil (Caesalpinia echinata) deu nome ao Brasil e foi intensamente explorado no início da colonização.' },
      // Lesson l-2-3
      { id: 'c-2-3-1', lessonId: 'l-2-3', type: 'WHO_AM_I' as const,
        content: 'Sou o líder do maior quilombo do Brasil colonial. Meu quilombo ficava na Serra da Barriga (AL) e durou quase 100 anos. Lutei pela liberdade dos escravizados. Quem sou eu?',
        options: ['Zumbi dos Palmares', 'Tiradentes', 'Antônio Conselheiro', 'José do Patrocínio'],
        correctAnswer: 'Zumbi dos Palmares',
        explanation: 'Zumbi foi o último líder do Quilombo dos Palmares, morto em 20 de novembro de 1695, data hoje comemorativa.' },
      { id: 'c-2-3-2', lessonId: 'l-2-3', type: 'TIMELINE' as const,
        content: 'Quando a escravidão africana começou no Brasil?',
        options: ['A partir de 1549', 'Com a chegada de Cabral em 1500', 'Somente no século XVIII', 'Com a independência em 1822'],
        correctAnswer: 'A partir de 1549',
        explanation: 'O tráfico de africanos escravizados se intensificou a partir de 1549 com a expansão do açúcar.' },
      // Lesson l-3-1
      { id: 'c-3-1-1', lessonId: 'l-3-1', type: 'TIMELINE' as const,
        content: 'Em que ano a família real portuguesa chegou ao Brasil?',
        options: ['1808', '1822', '1889', '1750'],
        correctAnswer: '1808',
        explanation: 'Em 1808, fugindo de Napoleão, D. João VI transferiu a corte para o Rio de Janeiro.' },
      { id: 'c-3-1-2', lessonId: 'l-3-1', type: 'DECISION_SCENARIO' as const,
        content: 'Você é D. João VI em 1808. Napoleão invadiu Portugal. Você tem duas opções: ficar e resistir em Portugal ou fugir para o Brasil. O que você faz?',
        options: ['Fujo para o Brasil com toda a corte', 'Fico em Portugal e luto contra Napoleão', 'Peço ajuda à Inglaterra sem sair', 'Me rendo a Napoleão'],
        correctAnswer: 'Fujo para o Brasil com toda a corte',
        explanation: 'D. João VI fez exatamente isso, transferindo 15 mil pessoas para o Brasil e tornando-o sede do Império Português.' },
      // Lesson l-3-2
      { id: 'c-3-2-1', lessonId: 'l-3-2', type: 'TIMELINE' as const,
        content: 'Em que data e local foi proclamada a Independência do Brasil?',
        options: ['7 de setembro de 1822, às margens do Rio Ipiranga (SP)', '15 de novembro de 1889, no Rio de Janeiro', '13 de maio de 1888, em Petrópolis', '22 de abril de 1500, em Porto Seguro'],
        correctAnswer: '7 de setembro de 1822, às margens do Rio Ipiranga (SP)',
        explanation: 'D. Pedro I proclamou a independência em 7 de setembro de 1822 às margens do Ipiranga, em São Paulo.' },
      { id: 'c-3-2-2', lessonId: 'l-3-2', type: 'WHO_AM_I' as const,
        content: 'Sou o filho de D. João VI. Fiquei no Brasil quando meu pai voltou para Portugal e proclamei a Independência. Fui coroado imperador do Brasil. Quem sou eu?',
        options: ['D. Pedro I', 'D. Pedro II', 'D. João VI', 'Leopoldina'],
        correctAnswer: 'D. Pedro I',
        explanation: 'D. Pedro I proclamou a independência em 1822 e foi o primeiro imperador do Brasil.' },
      // Lesson l-3-3
      { id: 'c-3-3-1', lessonId: 'l-3-3', type: 'TIMELINE' as const,
        content: 'Quando foi assinada a Lei Áurea que aboliu a escravidão no Brasil?',
        options: ['13 de maio de 1888', '15 de novembro de 1889', '7 de setembro de 1822', '20 de novembro de 1695'],
        correctAnswer: '13 de maio de 1888',
        explanation: 'A Lei Áurea foi assinada pela Princesa Isabel em 13 de maio de 1888.' },
      { id: 'c-3-3-2', lessonId: 'l-3-3', type: 'WHO_AM_I' as const,
        content: 'Sou a filha de D. Pedro II. Assinei a lei que aboliu a escravidão no Brasil em 1888. Fui chamada de "A Redentora". Quem sou eu?',
        options: ['Princesa Isabel', 'Leopoldina', 'Maria I de Portugal', 'Carolina Wilhelmina'],
        correctAnswer: 'Princesa Isabel',
        explanation: 'Princesa Isabel assinou a Lei Áurea em 13 de maio de 1888, ficando conhecida como "A Redentora".' },
      // Lesson l-4-1
      { id: 'c-4-1-1', lessonId: 'l-4-1', type: 'TIMELINE' as const,
        content: 'Em que data foi proclamada a República no Brasil?',
        options: ['15 de novembro de 1889', '7 de setembro de 1822', '13 de maio de 1888', '1 de janeiro de 1900'],
        correctAnswer: '15 de novembro de 1889',
        explanation: 'A República foi proclamada em 15 de novembro de 1889 pelo Marechal Deodoro da Fonseca.' },
      { id: 'c-4-1-2', lessonId: 'l-4-1', type: 'WHO_AM_I' as const,
        content: 'Sou o sistema político que dominou o Brasil de 1889 a 1930. Fui controlado pelos estados de São Paulo e Minas Gerais, em uma alternância chamada "café com leite". O que sou?',
        options: ['República Velha', 'Estado Novo', 'República da Espada', 'Segunda República'],
        correctAnswer: 'República Velha',
        explanation: 'A República Velha (1889-1930) foi dominada pela política do "café com leite" entre SP e MG.' },
      // Lesson l-4-2
      { id: 'c-4-2-1', lessonId: 'l-4-2', type: 'WHO_AM_I' as const,
        content: 'Sou o líder religioso e social que fundou o arraial de Canudos na Bahia. Meus seguidores me chamavam de "Bom Jesus" e resistiram a quatro expedições militares. Quem sou eu?',
        options: ['Antônio Conselheiro', 'Padre Cícero', 'Lampião', 'Zumbi'],
        correctAnswer: 'Antônio Conselheiro',
        explanation: 'Antônio Conselheiro liderou o arraial de Canudos, que resistiu ao governo republicano de 1896 a 1897.' },
      { id: 'c-4-2-2', lessonId: 'l-4-2', type: 'WORKS_AND_RELICS' as const,
        content: 'Qual obra literária descreveu o massacre de Canudos e se tornou um clássico da literatura brasileira?',
        options: ['Os Sertões (Euclides da Cunha)', 'Iracema (José de Alencar)', 'Vidas Secas (Graciliano Ramos)', 'Dom Casmurro (Machado de Assis)'],
        correctAnswer: 'Os Sertões (Euclides da Cunha)',
        explanation: '"Os Sertões" de Euclides da Cunha (1902) imortalizou a Guerra de Canudos e é uma das obras mais importantes da literatura brasileira.' },
      // Lesson l-4-3
      { id: 'c-4-3-1', lessonId: 'l-4-3', type: 'WHO_AM_I' as const,
        content: 'Sou um político gaúcho que governei o Brasil por 15 anos. Criei a CLT e o salário mínimo. Cometi suicídio em 1954 com uma carta histórica. Fui chamado de "pai dos pobres". Quem sou eu?',
        options: ['Getúlio Vargas', 'Juscelino Kubitschek', 'João Goulart', 'Marechal Deodoro'],
        correctAnswer: 'Getúlio Vargas',
        explanation: 'Getúlio Vargas governou de 1930 a 1945 e de 1951 a 1954, criando importantes direitos trabalhistas.' },
      { id: 'c-4-3-2', lessonId: 'l-4-3', type: 'WORKS_AND_RELICS' as const,
        content: 'O que é a CLT, criada por Vargas em 1943?',
        options: ['Consolidação das Leis do Trabalho', 'Código Legal Tributário', 'Comissão de Legislação Trabalhista', 'Carta de Leis Territoriais'],
        correctAnswer: 'Consolidação das Leis do Trabalho',
        explanation: 'A CLT (Consolidação das Leis do Trabalho) unificou as leis trabalhistas e garantiu direitos como férias e FGTS.' },
      // Lesson l-5-1
      { id: 'c-5-1-1', lessonId: 'l-5-1', type: 'TIMELINE' as const,
        content: 'Em que ano ocorreu o golpe militar que depôs João Goulart?',
        options: ['1964', '1968', '1945', '1970'],
        correctAnswer: '1964',
        explanation: 'O golpe militar de 31 de março de 1964 depôs o presidente João Goulart, iniciando 21 anos de ditadura.' },
      { id: 'c-5-1-2', lessonId: 'l-5-1', type: 'WHO_AM_I' as const,
        content: 'Sou um ato institucional de 1968 que suspendeu direitos políticos, fechou o Congresso e instaurou censura total. Fui o momento mais duro da ditadura militar brasileira. O que sou?',
        options: ['AI-5', 'AI-1', 'Constituição de 1967', 'Lei de Segurança Nacional'],
        correctAnswer: 'AI-5',
        explanation: 'O AI-5 (Ato Institucional nº 5), de 13 de dezembro de 1968, foi o instrumento mais autoritário da ditadura.' },
      // Lesson l-5-2
      { id: 'c-5-2-1', lessonId: 'l-5-2', type: 'DECISION_SCENARIO' as const,
        content: 'Você é um cidadão brasileiro em 1984. O movimento "Diretas Já" pede eleições diretas. O Congresso votará a emenda. O que você faz?',
        options: ['Participo das manifestações nas ruas', 'Fico em casa, não me envolvo em política', 'Apoio o governo militar', 'Peço eleições apenas para governadores'],
        correctAnswer: 'Participo das manifestações nas ruas',
        explanation: 'Milhões de brasileiros foram às ruas em 1984 pelo movimento Diretas Já, demonstrando o poder da mobilização popular.' },
      { id: 'c-5-2-2', lessonId: 'l-5-2', type: 'WHO_AM_I' as const,
        content: 'Fui o primeiro presidente civil eleito após a ditadura, mas morri antes de assumir. Meu vice tomou posse em meu lugar. Quem sou eu?',
        options: ['Tancredo Neves', 'José Sarney', 'Ulysses Guimarães', 'Fernando Collor'],
        correctAnswer: 'Tancredo Neves',
        explanation: 'Tancredo Neves foi eleito em 1985, mas faleceu em abril daquele ano. José Sarney, seu vice, governou no período de transição.' },
      // Lesson l-5-3
      { id: 'c-5-3-1', lessonId: 'l-5-3', type: 'TIMELINE' as const,
        content: 'Em que ano foi promulgada a Constituição Federal Brasileira conhecida como "Constituição Cidadã"?',
        options: ['1988', '1985', '1994', '1975'],
        correctAnswer: '1988',
        explanation: 'A Constituição de 1988 foi promulgada em 5 de outubro, sendo chamada de "Constituição Cidadã" por Ulysses Guimarães.' },
      { id: 'c-5-3-2', lessonId: 'l-5-3', type: 'WORKS_AND_RELICS' as const,
        content: 'Qual sistema de saúde universal foi criado pela Constituição de 1988?',
        options: ['SUS (Sistema Único de Saúde)', 'INSS (Instituto Nacional do Seguro Social)', 'FUNAI (Fundação Nacional dos Povos Indígenas)', 'IBGE (Instituto Brasileiro de Geografia)'],
        correctAnswer: 'SUS (Sistema Único de Saúde)',
        explanation: 'O SUS foi criado pela Constituição de 1988 como um sistema de saúde universal, gratuito e integral.' },
    ];

    for (const c of challengesData) {
      await this.prisma.challenge.upsert({
        where: { id: c.id },
        update: { content: c.content, options: c.options as any, correctAnswer: c.correctAnswer, explanation: c.explanation },
        create: {
          id: c.id,
          lessonId: c.lessonId,
          type: c.type,
          content: c.content,
          options: c.options as any,
          correctAnswer: c.correctAnswer,
          explanation: c.explanation,
          difficultyWeight: 1.0,
        },
      });
    }
  }

  async getModules() {
    return this.prisma.module.findMany({ orderBy: { order: 'asc' }, include: { lessons: true } });
  }

  async getLessonsByModule(moduleId: string) {
    return this.prisma.lesson.findMany({ where: { moduleId }, orderBy: { order: 'asc' } });
  }

  async getChallengesByLesson(lessonId: string) {
    return this.prisma.challenge.findMany({ where: { lessonId } });
  }
}
