# 📚 HistLingo - Guia Completo

## 🚀 INÍCIO RÁPIDO

### Opção 1: IntelliJ IDEA (RECOMENDADO)
```
1. Build > Build Project          (Ctrl+F9)
2. Run > Run HistlimgoApplication (Shift+F10)
3. Aguarde: "Tomcat started on port(s): 8082"
4. Abra: http://localhost:8082/swagger-ui.html
```

### Opção 2: Terminal
```powershell
cd C:\Users\user\IdeaProjects\HistLingo
mvn clean spring-boot:run
```

---

## 🌐 URLs PRINCIPAIS

| Recurso | URL |
|---------|-----|
| **API Base** | http://localhost:8082 |
| **Swagger UI** | http://localhost:8082/swagger-ui.html |
| **OpenAPI Docs** | http://localhost:8082/api-docs |
| **H2 Console** | http://localhost:8082/h2-console |

---



## 📦 TECNOLOGIAS

| Componente | Versão |
|-----------|--------|
| Java | 17 (openjdk-25.0.2) |
| Spring Boot | 3.2.3 |
| Spring Framework | 6.1.4 |
| Banco | H2 2.2.224 (em memória) |
| Build Tool | Maven 3.8.x |
| Lombok | 1.18.30 |
| Swagger | 2.0.2 |
| Tomcat | 10.1.19 |

---

## 🔧 CONFIGURAÇÕES

### Arquivo Principal
- **Location:** `src/main/resources/application.properties`
- **Porta:** 8082
- **Banco:** H2 em memória (jdbc:h2:mem:histlimgo)
- **Profile Ativo:** dev

### Banco de Dados H2
- **URL:** jdbc:h2:mem:histlimgo
- **User:** SA
- **Password:** (vazio)
- **Console:** http://localhost:8082/h2-console

---

## 🛠️ ESTRUTURA DO PROJETO

```
src/main/
├── java/com/histlimgo/
│   ├── HistlimgoApplication.java (classe principal)
│   ├── api/v1/
│   │   ├── controller/
│   │   │   ├── GlobalExceptionHandler.java
│   │   │   └── UserController.java
│   │   └── dto/
│   │       └── UserDTO.java
│   ├── application/service/
│   │   ├── GamificationService.java
│   │   └── SRSImplementation.java
│   ├── config/
│   │   └── OpenApiConfig.java
│   └── domain/
│       ├── model/
│       │   ├── Challenge.java
│       │   ├── Lesson.java
│       │   ├── Module.java
│       │   ├── User.java
│       │   └── etc...
│       └── repository/
│           └── UserRepository.java
└── resources/
    ├── application.properties
    ├── application-dev.properties
    ├── application-prod.properties
    └── db/migration/
        └── schema.sql
```

---

## 🐛 TROUBLESHOOTING

### Porta já em uso
Se porta 8082 estiver em uso, mude em `application.properties`:
```properties
server.port=8083
```

### Projeto não compila
1. Clique em `File > Invalidate Caches`
2. Reinicie o IntelliJ
3. Tente novamente

### Erro de banco de dados
O H2 está em memória, portanto:
- Dados são perdidos ao reiniciar
- Console H2 em http://localhost:8082/h2-console
- Para usar PostgreSQL: mude `application.properties`

---

## 📝 O QUE FOI FEITO



### Soluções Implementadas
✅ H2 Database adicionado ao pom.xml
✅ Lombok 1.18.30 configurado
✅ GamificationService.java recriado
✅ Schema SQL adaptado para H2
✅ Encoding dos arquivos corrigido
✅ Porta configurada para 8082
✅ Projeto compilando e rodando

---

## 📚 ENDPOINTS DISPONÍVEIS

Veja em: http://localhost:8082/swagger-ui.html

Principais controllers:
- **UserController** - Gerenciamento de usuários
- **GlobalExceptionHandler** - Tratamento centralizado de erros

---

## 💾 BANCO DE DADOS

### Schema Automático
O banco é criado automaticamente ao iniciar:
- Arquivo: `src/main/resources/db/migration/schema.sql`
- Tables: modules, lessons, challenges, users, user_reviews

### H2 Console
- URL: http://localhost:8082/h2-console
- JDBC URL: `jdbc:h2:mem:histlimgo`
- User: `SA`
- Password: (deixar em branco)

---

## 🎯 PRÓXIMAS AÇÕES

1. ✅ Compilar e rodar
2. ✅ Testar endpoints em Swagger UI
3. ✅ Verificar logs
4. ✅ Desenvolver features

---

## 📞 SUPORTE

Em caso de dúvidas:
- Verifique logs no console do IntelliJ
- Use H2 Console para inspecionar banco
- Teste endpoints em Swagger UI
- Verifique application.properties

---



