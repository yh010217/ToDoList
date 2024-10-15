package com.todolist.backend.domain;


import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "refresh_token")
@Getter
@NoArgsConstructor
@Setter
public class RefreshEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rid;

    @Column
    private Long uid;
    @Column
    private String refresh;
    @Column
    private String expiration;

    @Builder
    public RefreshEntity(Long uid, String refresh, String expiration) {
        this.uid = uid;
        this.refresh = refresh;
        this.expiration = expiration;
    }
}
