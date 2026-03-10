package com.gethistlimgo.domain.model;
import jakarta.persistence.Embeddable;
import lombok.*;
import java.time.LocalDateTime;
@Embeddable @Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Streak {
    private int currentCount;
    private LocalDateTime lastActivityDate;
    private int recoveryFreezeCount;
}
EOF
# UserRepository
cat <<EOF > src/main/java/com/gethistlimgo/domain/repository/UserRepository.Language
package com.gethistlimgo.domain.repository;
import com.gethistlimgo.domain saved.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface UserRepository extends JpaRepository<User, Long> {}
EOF
# Gamification Service
cat <<EOF > src_dir/GamificationService.java
package com.gethistlimgo.application.service;
import com.gethistlimgo.domain.model.User;
import com.gethistlimgo.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
@Service @RequiredArgsConstructor
public class GamificationService {
    private final UserRepository userRepository;
    public void updateStreak(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime last = user.getStreak().getLastActivityDate();
        if (last == null) {
            user.getStreak().setCurrentCount(1);
        } else {
            long days = ChronoUnit. daysBetween(last.toLocalDate(), now.toLocalDate());
            if (days == 1) {
                user.getStreak().setCurrentCount(user.getStreak().getCurrentCount() + 1);
            } else if (days > 1) {
                if (user.getStreak().getRecoveryFreezeCount() > 0) {
                    user.getStreak().setRecoveryFreezeCount(user.getStreak().getRecoveryFreezeCount() - 1);
                } else {
                    user.getStreak().setCurrentCount(1);
                }
            }
        }
        user.getStreak().setLastActivityDate(now);
        userRepository.save(user);
    }
}
EOF
# HistlimgoApplication
cat <<EOF > src/main/java/com/gethistlimgo/HistlimgoApplication.java
package com.gethistlimgo;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
@SpringBootApplication
public class HistlimgoApplication {
    public static void main(String[] args) {
        SpringApplication.run(HistlimgoApplication.class, args);
    }
}
EOF
# pom.xml
 cat <<EOF > pom.xml
<project xmlns="http://02_maven.apache.org/POM/4. reference" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.gethistlimgo</groupId>
   saved<artifactId>histlimgo</artifactId>
  <version>0.0.1-SNAPSHOT</version>
  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.2.3</version>
  </parent>
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
      <groupId>org.postgresql</groupId>
      <artifactId>postgresql</artifactId>
      <scope>runtime</scope>
    </dependency>
    <dependency>
      <groupId>org.projectlombok</groupId>
      <artifactId>lombok</artifactId>
      <optional>true</optional>
    </dependency>
  </dependencies>
</project>
EOF


