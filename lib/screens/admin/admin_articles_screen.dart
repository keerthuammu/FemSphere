import 'package:flutter/material.dart';
import '../../core/app_theme.dart';
import '../../models/article_model.dart';
import '../../services/api_service.dart';

class AdminArticlesScreen extends StatefulWidget {
  const AdminArticlesScreen({super.key});

  @override
  State<AdminArticlesScreen> createState() => _AdminArticlesScreenState();
}

class _AdminArticlesScreenState extends State<AdminArticlesScreen> {
  List<ArticleModel> _articles = [];
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadArticles();
  }

  Future<void> _loadArticles() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final raw = await ApiService.getAdminArticles();
      final List<ArticleModel> list = [];
      for (var item in raw) {
        if (item is Map<String, dynamic>) {
          list.add(ArticleModel.fromJson(item));
        }
      }
      setState(() {
        _articles = list;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load articles: $e';
        _isLoading = false;
      });
    }
  }

  Future<void> _deleteArticle(int id) async {
    try {
      await ApiService.deleteAdminArticle(id);
      setState(() => _articles.removeWhere((a) => a.id == id));
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Article deleted from CMS.')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to delete: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  void _openCreateArticleModal() {
    final titleController = TextEditingController();
    String category = 'Reproductive Health';
    final summaryController = TextEditingController();
    final contentController = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Padding(
              padding: EdgeInsets.only(
                left: 24,
                right: 24,
                top: 24,
                bottom: MediaQuery.of(context).viewInsets.bottom + 24,
              ),
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('✍️ Create Health CMS Article', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textDark)),
                        IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.pop(ctx)),
                      ],
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: titleController,
                      decoration: const InputDecoration(labelText: 'Article Title *', border: OutlineInputBorder()),
                    ),
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      value: category,
                      decoration: const InputDecoration(labelText: 'Category', border: OutlineInputBorder()),
                      items: const ['Reproductive Health', 'Nutrition & Fitness', 'Mental Health', 'AI Health Twin', 'Pediatrics']
                          .map((c) => DropdownMenuItem(value: c, child: Text(c)))
                          .toList(),
                      onChanged: (val) {
                        if (val != null) setModalState(() => category = val);
                      },
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: summaryController,
                      decoration: const InputDecoration(labelText: 'Summary / Subtitle *', border: OutlineInputBorder()),
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: contentController,
                      maxLines: 4,
                      decoration: const InputDecoration(labelText: 'Article Body Content *', border: OutlineInputBorder()),
                    ),
                    const SizedBox(height: 20),
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.primaryPurple,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                        onPressed: () async {
                          if (titleController.text.trim().isEmpty) return;

                          final payload = {
                            'title': titleController.text.trim(),
                            'category': category,
                            'description': summaryController.text.trim().isNotEmpty
                                ? summaryController.text.trim()
                                : contentController.text.trim(),
                            'imageUrl': '',
                          };

                          try {
                            await ApiService.createAdminArticle(payload);
                            if (mounted) {
                              Navigator.pop(ctx);
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('Article published successfully!'), backgroundColor: AppTheme.secondaryTeal),
                              );
                              _loadArticles();
                            }
                          } catch (e) {
                            if (mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('Failed to publish: $e'), backgroundColor: Colors.red),
                              );
                            }
                          }
                        },
                        child: const Text('Publish Article', style: TextStyle(fontWeight: FontWeight.bold)),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAF8FC),
      appBar: AppBar(
        title: const Text('📚 Health Education CMS'),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _loadArticles),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppTheme.primaryPurple,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.post_add),
        label: const Text('New Article'),
        onPressed: _openCreateArticleModal,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.primaryPurple))
          : _errorMessage != null
              ? Center(
                  child: Padding(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.cloud_off, size: 48, color: Colors.grey),
                        const SizedBox(height: 12),
                        Text(_errorMessage!, textAlign: TextAlign.center, style: const TextStyle(color: AppTheme.textMuted)),
                        const SizedBox(height: 16),
                        ElevatedButton(onPressed: _loadArticles, child: const Text('Retry')),
                      ],
                    ),
                  ),
                )
              : _articles.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.article_outlined, size: 54, color: AppTheme.primaryPurple.withValues(alpha: 0.3)),
                          const SizedBox(height: 16),
                          const Text('No articles published yet', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textDark)),
                          const SizedBox(height: 6),
                          const Text('Tap "New Article" to create wellness and medical education guides.', style: TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                        ],
                      ),
                    )
                  : RefreshIndicator(
                      onRefresh: _loadArticles,
                      child: ListView.separated(
                        padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
                        itemCount: _articles.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 14),
                        itemBuilder: (context, index) {
                          final a = _articles[index];
                          return Container(
                            padding: const EdgeInsets.all(18),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: AppTheme.borderPurple),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFFF3E8FF),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Text(a.category, style: const TextStyle(fontSize: 11, color: AppTheme.primaryPurple, fontWeight: FontWeight.bold)),
                                    ),
                                    IconButton(
                                      icon: const Icon(Icons.delete_outline, color: Colors.redAccent, size: 18),
                                      onPressed: () => _deleteArticle(a.id),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                Text(a.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.textDark)),
                                const SizedBox(height: 6),
                                Text(a.summary, style: const TextStyle(fontSize: 12, color: AppTheme.textMuted, height: 1.4)),
                                const Divider(height: 20),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text('By ${a.author}', style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                                    Text('${a.date} • ${a.readTime}', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppTheme.textDark)),
                                  ],
                                ),
                              ],
                            ),
                          );
                        },
                      ),
                    ),
    );
  }
}
