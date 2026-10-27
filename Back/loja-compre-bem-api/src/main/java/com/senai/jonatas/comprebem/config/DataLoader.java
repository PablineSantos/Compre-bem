package com.senai.jonatas.comprebem.config;

import com.senai.jonatas.comprebem.entity.Produto;
import com.senai.jonatas.comprebem.repository.ProdutoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.List;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(ProdutoRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                Produto p1 = new Produto();
                p1.setNome("Cadeira");
                p1.setDescricao("Cadeira ergonômica estofada, ideal para home office");
                p1.setPreco(new BigDecimal("199.90"));
                p1.setQuantidade(10);
                p1.setCategoria("Móveis");

                Produto p2 = new Produto();
                p2.setNome("Mesa");
                p2.setDescricao("Mesa de escritório em L com acabamento em madeira");
                p2.setPreco(new BigDecimal("450.00"));
                p2.setQuantidade(5);
                p2.setCategoria("Móveis");

                Produto p3 = new Produto();
                p3.setNome("Monitor");
                p3.setDescricao("Monitor 24 polegadas Full HD com bordas finas");
                p3.setPreco(new BigDecimal("850.00"));
                p3.setQuantidade(15);
                p3.setCategoria("Informática");

                repository.saveAll(List.of(p1, p2, p3));
            }
        };
    }
}
